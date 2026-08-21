/**
 * Dynamic API Base URL Config
 * Resolves to 'http://localhost:5001' during local dev and '' (same-origin relative URL) in Vercel production.
 */
export const API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:5001' : '');
