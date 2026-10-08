import { fetchWithTimeout } from './httpFetch';

/**
 * Inspection photos are stored inline with the inspection record, so a raw
 * phone capture — commonly 4-12 MB — has to be carried through every save,
 * sync and report. Downscaling on the device first is what keeps attaching a
 * photo feeling instant instead of looking like the app has hung.
 */

const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;

const readAsDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error ?? new Error('Could not read the image'));
        reader.readAsDataURL(file);
    });

/** Decode via createImageBitmap where available, falling back to an <img>. */
const decode = async (file: File): Promise<{ source: CanvasImageSource; width: number; height: number } | null> => {
    if (typeof createImageBitmap === 'function') {
        try {
            const bitmap = await createImageBitmap(file);
            return { source: bitmap, width: bitmap.width, height: bitmap.height };
        } catch {
            // Fall through to the <img> path.
        }
    }

    const dataUrl = await readAsDataUrl(file).catch(() => null);
    if (!dataUrl) return null;

    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ source: img, width: img.naturalWidth, height: img.naturalHeight });
        img.onerror = () => resolve(null);
        img.src = dataUrl;
    });
};

/**
 * Returns a JPEG data URL no larger than MAX_DIMENSION on its longest edge.
 * If anything about the resize fails the original file is returned unchanged,
 * so a photo is never lost just because it could not be shrunk.
 */
/** Turns a data URL back into a Blob so it can be posted as a file. */
const dataUrlToBlob = async (dataUrl: string): Promise<Blob> => (await fetch(dataUrl)).blob();

/**
 * Native capture, used in the app in place of <input type="file" capture>.
 *
 * That input was wrong on both platforms. On iOS WKWebView ignores `capture`
 * and opens the photo library instead of the camera. On Android it launches
 * the camera as a separate activity, and the backgrounded WebView is often
 * reclaimed under memory pressure — the page then reloads and restores the
 * item's saved finding, which drops the inspector on the report screen
 * instead of back in the form they were filling in.
 *
 * The native plugin runs in-process, so neither happens.
 */
const nativeCamera = (): { call: (m: string, o?: unknown) => Promise<any> } | null => {
    if (typeof window === 'undefined') return null;
    const cap = (window as any).Capacitor;
    if (!cap?.isNativePlatform?.() || typeof cap.nativePromise !== 'function') return null;
    const registered = Array.isArray(cap.PluginHeaders) && cap.PluginHeaders.some((h: any) => h?.name === 'Camera');
    if (!registered) return null;
    return { call: (m, o) => cap.nativePromise('Camera', m, o) };
};

export const isNativeCameraAvailable = (): boolean => nativeCamera() !== null;

/**
 * Opens the camera (or gallery) natively and returns a data URL, or null if
 * the plugin is unavailable or the user cancelled. Callers fall back to the
 * hidden file input when this returns null for lack of a plugin.
 */
export const takeNativePhoto = async (source: 'camera' | 'gallery'): Promise<string | null> => {
    const camera = nativeCamera();
    if (!camera) return null;

    try {
        // getPhoto, not takePhoto/chooseFromGallery: on Android the latter two
        // route through the newer flow, which only ever resolves a file uri and
        // webPath — and a webPath served by the local Capacitor host is not
        // readable from this remotely-hosted page. getPhoto returns a data URL
        // directly on both platforms, which is what we can actually use.
        const result = await camera.call('getPhoto', {
            source: source === 'camera' ? 'CAMERA' : 'PHOTOS',
            quality: 85,
            resultType: 'dataUrl',
            correctOrientation: true,
            allowEditing: false,
            saveToGallery: false,
        });
        const dataUrl: string | undefined = result?.dataUrl;
        // The caller re-encodes this through the canvas path, so a device that
        // hands back a full-resolution frame still gets resized.
        return dataUrl || null;
    } catch {
        // Cancelled, or permission refused — treated the same as no photo.
        return null;
    }
};

/**
 * Stores the photo server-side and returns a short URL to it.
 *
 * Keeping photos inline is what pushed inspection records past MongoDB's 16 MB
 * ceiling and made saves fail once an inspector had taken a few. Uploading
 * first means the record only ever carries a URL.
 *
 * If the upload cannot happen — no signal on site, server unreachable — the
 * compressed data URL is returned instead so the capture is never lost; it
 * still syncs with the rest of the offline queue.
 */
export const uploadDataUrl = async (dataUrl: string): Promise<string> => {
    if (!dataUrl.startsWith('data:')) return dataUrl;
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return dataUrl;

    try {
        const token = localStorage.getItem('token');
        if (!token) return dataUrl;

        const body = new FormData();
        body.append('image', await dataUrlToBlob(dataUrl), 'inspection-photo.jpg');

        const res = await fetchWithTimeout('/api/images', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body,
        });
        if (!res.ok) return dataUrl;

        const data = await res.json();
        return data?.success && data?.url ? data.url : dataUrl;
    } catch {
        return dataUrl;
    }
};

export const captureInspectionPhoto = async (file: File): Promise<string> =>
    uploadDataUrl(await fileToCompressedDataUrl(file));

/**
 * Camera-or-gallery capture for the app. Returns the stored photo's URL, or
 * null when there is no native camera to use (the caller then opens the hidden
 * file input) or the user backed out.
 */
export const captureInspectionPhotoNative = async (
    source: 'camera' | 'gallery'
): Promise<string | null> => {
    const dataUrl = await takeNativePhoto(source);
    if (!dataUrl) return null;

    const blob = await dataUrlToBlob(dataUrl);
    const file = new File([blob], 'inspection-photo.jpg', { type: blob.type || 'image/jpeg' });
    return captureInspectionPhoto(file);
};

/**
 * Swaps any still-inline photo in a queued payload for a hosted URL before it
 * goes up. Captures made with no signal keep their data URL until this runs.
 */
export const uploadQueuedPhotos = async (payload: any): Promise<any> => {
    const findings = payload?.inspectionData?.findings;
    if (!Array.isArray(findings)) return payload;

    const swapped = await Promise.all(
        findings.map(async (finding: any) =>
            typeof finding?.imageUri === 'string' && finding.imageUri.startsWith('data:')
                ? { ...finding, imageUri: await uploadDataUrl(finding.imageUri) }
                : finding
        )
    );

    return { ...payload, inspectionData: { ...payload.inspectionData, findings: swapped } };
};

export const fileToCompressedDataUrl = async (file: File): Promise<string> => {
    const decoded = await decode(file);
    if (!decoded || !decoded.width || !decoded.height) return readAsDataUrl(file);

    const { source, width, height } = decoded;
    const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
    const targetWidth = Math.max(1, Math.round(width * scale));
    const targetHeight = Math.max(1, Math.round(height * scale));

    try {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return readAsDataUrl(file);

        ctx.drawImage(source, 0, 0, targetWidth, targetHeight);
        const out = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
        // A canvas that produced nothing usable shouldn't cost us the photo.
        return out && out.length > 'data:image/jpeg;base64,'.length ? out : await readAsDataUrl(file);
    } catch {
        return readAsDataUrl(file);
    } finally {
        if (typeof ImageBitmap !== 'undefined' && source instanceof ImageBitmap) source.close();
    }
};
