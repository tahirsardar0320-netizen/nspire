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
