// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Generic API request function with fallback
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  // Try 1: External backend API if configured
  if (API_URL) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);

      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        throw new Error('Unauthorized');
      }

      const data = await response.json();
      if (response.ok) return data;
    } catch (extError) {
      console.warn(`External API failed for ${endpoint}, trying internal route...`);
    }
  }

  // Try 2: Internal Next.js API route (same origin)
  try {
    const response = await fetch(endpoint, config);

    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      throw new Error('Unauthorized');
    }

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'Something went wrong') as any;
      error.data = data;
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (intError: any) {
    // If it's already a structured error, re-throw
    if (intError.status) throw intError;
    // Otherwise wrap
    throw new Error(intError.message || `API request failed: ${endpoint}`);
  }
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string, rememberMe: boolean, role: string) => {
    return apiRequest<{
      success: boolean;
      message: string;
      token: string;
      user: {
        id: string;
        fullName: string;
        email: string;
        role: string;
      };
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, rememberMe, role }),
    });
  },

  signup: async (fullName: string, email: string, password: string, role: string) => {
    return apiRequest<{
      success: boolean;
      message: string;
      token: string;
      user: {
        id: string;
        fullName: string;
        email: string;
        role: string;
      };
    }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, password, role }),
    });
  },

  getMe: async () => {
    return apiRequest<{
      success: boolean;
      user: {
        id: string;
        fullName: string;
        email: string;
        role: string;
        phone?: string;
        language?: string;
        timezone?: string;
      };
    }>('/api/auth/me');
  },

  logout: async () => {
    return apiRequest<{ success: boolean; message: string }>('/api/auth/logout', {
      method: 'POST',
    });
  },

  verifyToken: async () => {
    return apiRequest<{ success: boolean; valid: boolean }>('/api/auth/verify-token', {
      method: 'POST',
    });
  },

  getCaptcha: async () => {
    return apiRequest<{
      success: boolean;
      captchaId: string;
      captchaImage: string;
    }>('/api/captcha/generate');
  },

  signupWithCaptcha: async (
    fullName: string,
    email: string,
    password: string,
    role: string,
    captchaId: string,
    captchaCode: string
  ) => {
    return apiRequest<{
      success: boolean;
      message: string;
      token?: string;
      user?: {
        id: string;
        fullName: string;
        email: string;
        role: string;
      };
      requiresVerification?: boolean;
    }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, password, role, captchaId, captchaCode }),
    });
  },

  sendVerificationEmail: async (email: string) => {
    return apiRequest<{ success: boolean; message: string }>('/api/auth/send-verification-email', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  verifyEmail: async (email: string, otp: string) => {
    return apiRequest<{ success: boolean; message: string }>('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },

  resendVerificationOTP: async (email: string) => {
    return apiRequest<{ success: boolean; message: string }>('/api/auth/resend-verification-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  forgotPassword: async (email: string) => {
    return apiRequest<{ success: boolean; message: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  verifyResetOTP: async (email: string, otp: string) => {
    return apiRequest<{ success: boolean; message: string }>('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },

  resetPassword: async (email: string, otp: string, newPassword: string) => {
    return apiRequest<{ success: boolean; message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword }),
    });
  },

  resendResetOTP: async (email: string) => {
    return apiRequest<{ success: boolean; message: string }>('/api/auth/resend-reset-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  socialLogin: async (email: string, fullName: string, portal: string, provider: string) => {
    return apiRequest<{
      success: boolean;
      message: string;
      token: string;
      user: {
        id: string;
        fullName: string;
        email: string;
        role: string;
      };
    }>('/api/auth/social-login', {
      method: 'POST',
      body: JSON.stringify({ email, fullName, portal, provider }),
    });
  },
};

function getLocalCache(): any[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('inspire_local_properties');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [];
}

function saveLocalCache(props: any[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('inspire_local_properties', JSON.stringify(props));
  } catch (e) {}
}

// Helper: call internal Next.js API route directly (bypasses external backend)
async function internalRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Abort after 3s so we don't hang if MongoDB is unreachable
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    signal: controller.signal,
    ...options,
  };
  try {
    const response = await fetch(endpoint, config);
    clearTimeout(timer);
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.message || 'Request failed') as any;
      error.status = response.status;
      throw error;
    }
    return data;
  } catch (err: any) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw err;
  }
}

// Properties API — MongoDB (internal Next.js API) is the primary source of truth.
// localStorage is used as a read-cache for speed and offline fallback.
export const propertiesAPI = {
  create: async (propertyData: {
    propertyId: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    buildings: number;
    units: number;
  }) => {
    // 1. Save to MongoDB via internal API (primary)
    try {
      const result = await internalRequest<any>('/api/properties', {
        method: 'POST',
        body: JSON.stringify(propertyData),
      });
      if (result.success && result.property) {
        // Update local cache with the saved property (use MongoDB _id)
        const cache = getLocalCache();
        cache.unshift(result.property);
        saveLocalCache(cache);
        return { success: true, message: 'Property created successfully', property: result.property };
      }
    } catch (e: any) {
      // The server responded but rejected the request (validation error, etc.) —
      // this is a real failure the user needs to see, not something to paper over
      // with a fake local-only property that later breaks every downstream save.
      if (e?.status) {
        throw e;
      }
      console.warn('Backend unreachable, using local fallback:', e);
    }

    // 2. Fallback: save locally if backend unavailable
    const newProp = {
      _id: propertyData.propertyId || 'prop_' + Date.now(),
      ...propertyData,
      createdAt: new Date().toISOString(),
    };
    const cache = getLocalCache();
    cache.unshift(newProp);
    saveLocalCache(cache);
    return { success: true, message: 'Property created successfully', property: newProp };
  },

  createBulk: async (properties: Array<{
    propertyId: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    buildings: number;
    units: number;
  }>) => {
    const results: any[] = [];
    for (const p of properties) {
      try {
        const result = await internalRequest<any>('/api/properties', {
          method: 'POST',
          body: JSON.stringify(p),
        });
        if (result.success && result.property) {
          results.push(result.property);
        }
      } catch (e) {
        // fallback local
        const newProp = { _id: p.propertyId || `prop_${Date.now()}`, ...p, createdAt: new Date().toISOString() };
        results.push(newProp);
      }
    }
    const cache = getLocalCache();
    const existingIds = new Set(cache.map((c: any) => c._id || c.propertyId));
    results.forEach(r => { if (!existingIds.has(r._id || r.propertyId)) cache.unshift(r); });
    saveLocalCache(cache);
    return { success: true, message: 'Properties created successfully', properties: results };
  },

  getDropdownData: async () => {
    try {
      return await internalRequest<{
        success: boolean;
        data: {
          countries: string[];
          states: Record<string, string[]>;
          cities: Record<string, Record<string, string[]>>;
        };
      }>('/api/properties/dropdown-data');
    } catch (e) {
      return {
        success: true,
        data: {
          countries: ['United States'],
          states: { 'United States': ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'] },
          cities: { 'United States': { 'Alaska': ['Anchorage', 'Fairbanks', 'Juneau'], 'Arizona': ['Phoenix', 'Tucson', 'Mesa'], 'California': ['Los Angeles', 'San Francisco', 'San Diego'], 'New York': ['New York City', 'Buffalo', 'Rochester'], 'Texas': ['Houston', 'Dallas', 'Austin'], 'Washington': ['Seattle', 'Tacoma', 'Spokane'] } }
        }
      };
    }
  },

  getAll: async (params?: {
    search?: string;
    state?: string;
    city?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    let props: any[] = [];

    // 1. Primary: fetch from MongoDB via internal API
    try {
      const queryString = new URLSearchParams(
        Object.entries(params || {}).filter(([_, v]) => v !== undefined) as [string, string][]
      ).toString();
      const apiResult = await internalRequest<{
        success: boolean;
        properties: any[];
        pagination: any;
      }>(`/api/properties${queryString ? `?${queryString}` : ''}`);

      if (apiResult.success && Array.isArray(apiResult.properties)) {
        props = apiResult.properties;
        // Merge with any local-only properties (created while offline)
        const localProps = getLocalCache();
        const serverIds = new Set(props.map((p: any) => String(p._id || p.propertyId)));
        localProps.forEach((lp: any) => {
          const lid = String(lp._id || lp.propertyId);
          // Only include local props that look like local fallbacks (not real ObjectIds)
          if (!serverIds.has(lid) && !lid.match(/^[0-9a-fA-F]{24}$/)) {
            props.push(lp);
          }
        });
        // Update cache with server data
        saveLocalCache(props);
        return {
          success: true,
          properties: props,
          pagination: apiResult.pagination || { page: 1, limit: 100, total: props.length, pages: 1 },
        };
      }
    } catch (e) {
      console.warn('MongoDB fetch failed, using local cache:', e);
    }

    // 2. Fallback: use localStorage cache
    props = getLocalCache();
    if (params?.search) {
      const s = params.search.toLowerCase();
      props = props.filter(p =>
        (p.name && p.name.toLowerCase().includes(s)) ||
        (p.propertyId && String(p.propertyId).toLowerCase().includes(s)) ||
        (p.address && p.address.toLowerCase().includes(s))
      );
    }
    if (params?.state) {
      props = props.filter(p => p.state && p.state.toLowerCase() === params.state?.toLowerCase());
    }
    if (params?.city) {
      props = props.filter(p => p.city && p.city.toLowerCase() === params.city?.toLowerCase());
    }

    return {
      success: true,
      properties: props,
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 100,
        total: props.length,
        pages: 1,
      }
    };
  },

  getById: async (id: string) => {
    // Try MongoDB first
    try {
      const result = await internalRequest<{ success: boolean; property: any }>(`/api/properties/${id}`);
      if (result.success && result.property) {
        return { success: true, property: result.property };
      }
    } catch (e) {}

    // Fallback: localStorage cache
    const cache = getLocalCache();
    const prop = cache.find(p => p._id === id || p.propertyId === id);
    return { success: true, property: prop || null };
  },

  update: async (id: string, propertyData: any) => {
    // 1. Update in MongoDB (primary)
    try {
      const result = await internalRequest<any>(`/api/properties/${id}`, {
        method: 'PUT',
        body: JSON.stringify(propertyData),
      });
      if (result.success && result.property) {
        // Update cache
        const cache = getLocalCache();
        const idx = cache.findIndex(p => p._id === id || p.propertyId === id);
        if (idx !== -1) {
          cache[idx] = { ...cache[idx], ...result.property };
          saveLocalCache(cache);
        }
        return { success: true, message: 'Property updated successfully', property: result.property };
      }
    } catch (e) {
      console.warn('MongoDB update failed, updating local only:', e);
    }

    // 2. Fallback: update in localStorage
    const cache = getLocalCache();
    const idx = cache.findIndex(p => p._id === id || p.propertyId === id);
    let updatedProp = propertyData;
    if (idx !== -1) {
      cache[idx] = { ...cache[idx], ...propertyData, updatedAt: new Date().toISOString() };
      updatedProp = cache[idx];
      saveLocalCache(cache);
    }
    return { success: true, message: 'Property updated successfully', property: updatedProp };
  },

  delete: async (id: string) => {
    // 1. Delete from MongoDB (primary)
    try {
      await internalRequest<any>(`/api/properties/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('MongoDB delete failed:', e);
    }

    // 2. Always also remove from local cache
    const cache = getLocalCache().filter(p => p._id !== id && p.propertyId !== id);
    saveLocalCache(cache);

    return { success: true, message: 'Property deleted successfully' };
  },

  setReadyForInspection: async (id: string) => {
    try {
      return await internalRequest<{ success: boolean; message: string; property: any }>(
        `/api/properties/${id}/ready`,
        { method: 'PATCH' }
      );
    } catch (e) {
      return { success: true, message: 'Property set ready', property: null };
    }
  },

  hold: async (id: string) => {
    try {
      return await internalRequest<{ success: boolean; message: string; property: any }>(
        `/api/properties/${id}/hold`,
        { method: 'PATCH' }
      );
    } catch (e) {
      return { success: true, message: 'Property on hold', property: null };
    }
  },

  getStats: async () => {
    try {
      return await internalRequest<{
        success: boolean;
        stats: {
          totalProperties: number;
          totalBuildings: number;
          totalUnits: number;
          activeProperties: number;
          readyForInspection: number;
        };
      }>('/api/properties/stats');
    } catch (e) {
      const cache = getLocalCache();
      return {
        success: true,
        stats: {
          totalProperties: cache.length,
          totalBuildings: cache.reduce((sum: number, p: any) => sum + (p.buildings || 0), 0),
          totalUnits: cache.reduce((sum: number, p: any) => sum + (p.units || 0), 0),
          activeProperties: cache.length,
          readyForInspection: 0,
        }
      };
    }
  },

  getAllManagement: async (params?: any) => {
    try {
      const queryString = new URLSearchParams(
        Object.entries(params || {}).filter(([_, v]) => v !== undefined) as [string, string][]
      ).toString();
      return await internalRequest<{ success: boolean; properties: any[]; pagination: any }>(
        `/api/properties/all${queryString ? `?${queryString}` : ''}`
      );
    } catch (e) {
      const cache = getLocalCache();
      return { success: true, properties: cache, pagination: { page: 1, limit: 100, total: cache.length, pages: 1 } };
    }
  },
};

// Inspections API
export const inspectionsAPI = {
  create: async (inspectionData: any) => {
    return apiRequest<{ success: boolean; message: string; inspection: any }>(
      '/api/inspections',
      {
        method: 'POST',
        body: JSON.stringify(inspectionData),
      }
    );
  },

  getAll: async (params?: {
    status?: string;
    property?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryString = new URLSearchParams(
      Object.entries(params || {}).filter(([_, v]) => v !== undefined) as [string, string][]
    ).toString();
    return apiRequest<{
      success: boolean;
      inspections: any[];
      pagination: any;
    }>(`/api/inspections${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id: string) => {
    return apiRequest<{ success: boolean; inspection: any }>(`/api/inspections/${id}`);
  },

  update: async (id: string, data: any) => {
    return apiRequest<{ success: boolean; message: string; inspection: any }>(
      `/api/inspections/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  },

  complete: async (id: string, data: any) => {
    return apiRequest<{ success: boolean; message: string; inspection: any }>(
      `/api/inspections/${id}/complete`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    );
  },

  delete: async (id: string) => {
    return apiRequest<{ success: boolean; message: string }>(`/api/inspections/${id}`, {
      method: 'DELETE',
    });
  },

  getStats: async () => {
    return apiRequest<{
      success: boolean;
      stats: {
        totalInspections: number;
        completed: number;
        scheduled: number;
        inProgress: number;
        passed: number;
        failed: number;
        averageScore: number;
      };
    }>('/api/inspections/stats');
  },

  createRequest: async (requestData: any) => {
    return apiRequest<{ success: boolean; message: string; request: any }>(
      '/api/inspections/request',
      {
        method: 'POST',
        body: JSON.stringify(requestData),
      }
    );
  },

  getRequests: async (params?: any) => {
    const queryString = new URLSearchParams(
      Object.entries(params || {}).filter(([_, v]) => v !== undefined) as [string, string][]
    ).toString();
    return apiRequest<{ success: boolean; requests: any[]; pagination: any }>(
      `/api/inspections/requests${queryString ? `?${queryString}` : ''}`
    );
  },

  generateShareLink: async (id: string) => {
    return apiRequest<{
      success: boolean;
      message: string;
      shareUrl: string;
      expiresAt: string;
    }>(`/api/inspections/${id}/share`, {
      method: 'POST',
    });
  },

  getSharedReport: async (token: string) => {
    return apiRequest<{ success: boolean; inspection: any }>(
      `/api/inspections/shared/${token}`
    );
  },

  getUnitStatus: async (propertyId: string, buildingId: string) => {
    return apiRequest<{
      success: boolean;
      statuses: any[];
      unitStatusMap: Record<string, boolean>;
    }>(`/api/inspections/unit-status?property_id=${propertyId}&building_id=${buildingId}`);
  },

  saveProgress: async (data: any) => {
    return apiRequest<{
      success: boolean;
      msg: string;
      buildingInspectionId: string;
    }>('/api/inspections/progress', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getProgress: async (params: {
    property_id: string;
    unit_id?: string;
    building_id?: string;
    inspection_type?: string;
    draft_only?: string;
  }) => {
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined) as [string, string][]
    ).toString();
    return apiRequest<{
      progress?: any[];
    }>(`/api/inspections/progress?${queryString}`);
  },

  generateExcel: async (data: any) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/inspections/generate-excel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ data }),
    });
    if (!response.ok) throw new Error('Failed to generate Excel report');
    return response.blob();
  },

  completeByProperty: async (propertyId: string, data: any) => {
    return apiRequest<{ success: boolean; message: string; inspection: any }>(
      '/api/inspections/complete',
      {
        method: 'POST',
        body: JSON.stringify({ property_id: propertyId, ...data }),
      }
    );
  },
};

// Orders API
export const ordersAPI = {
  create: async (orderData: any) => {
    return apiRequest<{ success: boolean; message: string; order: any }>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  getAll: async (params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryString = new URLSearchParams(
      Object.entries(params || {}).filter(([_, v]) => v !== undefined) as [string, string][]
    ).toString();
    return apiRequest<{ success: boolean; orders: any[]; pagination: any }>(
      `/api/orders${queryString ? `?${queryString}` : ''}`
    );
  },

  getById: async (id: string) => {
    return apiRequest<{ success: boolean; order: any }>(`/api/orders/${id}`);
  },

  update: async (id: string, data: any) => {
    return apiRequest<{ success: boolean; message: string; order: any }>(
      `/api/orders/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  },

  delete: async (id: string) => {
    return apiRequest<{ success: boolean; message: string }>(`/api/orders/${id}`, {
      method: 'DELETE',
    });
  },

  getStats: async () => {
    return apiRequest<{
      success: boolean;
      stats: {
        totalOrders: number;
        pending: number;
        completed: number;
        inProgress: number;
        totalRevenue: number;
        completedToday: number;
      };
    }>('/api/orders/stats');
  },
};

// Assets API
export const assetsAPI = {
  create: async (assetData: any) => {
    return apiRequest<{ success: boolean; message: string; asset: any }>('/api/assets', {
      method: 'POST',
      body: JSON.stringify(assetData),
    });
  },

  getAll: async (params?: {
    status?: string;
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryString = new URLSearchParams(
      Object.entries(params || {}).filter(([_, v]) => v !== undefined) as [string, string][]
    ).toString();
    return apiRequest<{ success: boolean; assets: any[]; pagination: any }>(
      `/api/assets${queryString ? `?${queryString}` : ''}`
    );
  },

  getById: async (id: string) => {
    return apiRequest<{ success: boolean; asset: any }>(`/api/assets/${id}`);
  },

  update: async (id: string, data: any) => {
    return apiRequest<{ success: boolean; message: string; asset: any }>(
      `/api/assets/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  },

  delete: async (id: string) => {
    return apiRequest<{ success: boolean; message: string }>(`/api/assets/${id}`, {
      method: 'DELETE',
    });
  },

  addMaintenance: async (id: string, maintenanceData: any) => {
    return apiRequest<{ success: boolean; message: string; asset: any }>(
      `/api/assets/${id}/maintenance`,
      {
        method: 'POST',
        body: JSON.stringify(maintenanceData),
      }
    );
  },

  getStats: async () => {
    return apiRequest<{
      success: boolean;
      stats: {
        totalAssets: number;
        active: number;
        maintenance: number;
        inactive: number;
        totalValue: number;
      };
    }>('/api/assets/stats');
  },
};

// Users API
export const usersAPI = {
  updateProfile: async (profileData: {
    fullName?: string;
    email?: string;
    phone?: string;
    language?: string;
    timezone?: string;
    role?: string;
  }) => {
    return apiRequest<{ success: boolean; message: string; user: any }>(
      '/api/users/profile',
      {
        method: 'PUT',
        body: JSON.stringify(profileData),
      }
    );
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    return apiRequest<{ success: boolean; message: string }>('/api/users/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  updateNotificationSettings: async (
    emailNotifications: boolean,
    inAppNotifications: boolean
  ) => {
    return apiRequest<{ success: boolean; message: string }>('/api/users/notifications', {
      method: 'PUT',
      body: JSON.stringify({ emailNotifications, inAppNotifications }),
    });
  },

  toggleTwoFactor: async () => {
    return apiRequest<{ success: boolean; message: string; twoFactorEnabled: boolean }>(
      '/api/users/2fa/toggle',
      {
        method: 'POST',
      }
    );
  },

  getAllUsers: async (params?: { role?: string; search?: string; page?: number; limit?: number }) => {
    const queryString = new URLSearchParams(
      Object.entries(params || {}).filter(([_, v]) => v !== undefined) as [string, string][]
    ).toString();
    return apiRequest<{ success: boolean; users: any[]; pagination: any }>(
      `/api/users${queryString ? `?${queryString}` : ''}`
    );
  },

  getOtherUsers: async (params?: { role?: string; search?: string; page?: number; limit?: number }) => {
    const queryString = new URLSearchParams(
      Object.entries(params || {}).filter(([_, v]) => v !== undefined) as [string, string][]
    ).toString();
    return apiRequest<{ success: boolean; users: any[]; pagination: any }>(
      `/api/users/others${queryString ? `?${queryString}` : ''}`
    );
  },
};

// Admin API (for management portal)
export const adminAPI = {
  getInspections: async (params?: { status?: string; search?: string; page?: number; limit?: number }) => {
    const queryString = new URLSearchParams(
      Object.entries(params || {}).filter(([_, v]) => v !== undefined) as [string, string][]
    ).toString();
    return apiRequest<{ success: boolean; inspections: any[]; pagination: any }>(
      `/api/admin/inspections${queryString ? `?${queryString}` : ''}`
    );
  },
  getStats: async () => {
    return apiRequest<{ success: boolean; stats: any }>('/api/admin/stats');
  },
};

// Payments API
export const paymentsAPI = {
  checkReportUnlock: async (inspectionId: string) => {
    return apiRequest<{ success: boolean; isReportUnlocked: boolean }>(
      `/api/payments/check-unlock/${encodeURIComponent(inspectionId)}`
    );
  },

  createStripeCheckoutSession: async (inspectionId: string) => {
    return apiRequest<{
      success: boolean;
      message: string;
      checkoutUrl?: string;
      sessionId?: string;
      isReportUnlocked?: boolean;
      alreadyUnlocked?: boolean;
    }>('/api/payments/create-stripe-checkout-session', {
      method: 'POST',
      body: JSON.stringify({ inspectionId }),
    });
  },

  getStripeSessionStatus: async (sessionId: string) => {
    return apiRequest<{
      success: boolean;
      paymentStatus: string;
      isReportUnlocked: boolean;
      sessionId: string;
    }>(`/api/payments/stripe-session-status/${encodeURIComponent(sessionId)}`);
  },
};

export default {
  auth: authAPI,
  properties: propertiesAPI,
  inspections: inspectionsAPI,
  orders: ordersAPI,
  assets: assetsAPI,
  users: usersAPI,
  admin: adminAPI,
  payments: paymentsAPI,
};
