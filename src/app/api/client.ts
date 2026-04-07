export const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api';

function getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function request(endpoint: string, options: RequestInit = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.error || 'API Request Failed');
    }

    return data;
}

export const api = {
    get: (endpoint: string, options?: RequestInit) => request(endpoint, { ...options, method: 'GET' }),
    post: (endpoint: string, body: any, options?: RequestInit) => request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
    put: (endpoint: string, body: any, options?: RequestInit) => request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    delete: (endpoint: string, options?: RequestInit) => request(endpoint, { ...options, method: 'DELETE' }),
};
