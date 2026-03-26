const DEFAULT_DEV_API_PORT = '5001';
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '0.0.0.0']);

function trimTrailingSlash(value = '') {
  return value.replace(/\/+$/, '');
}

function getFallbackOrigin() {
  if (typeof window === 'undefined') {
    return `http://localhost:${DEFAULT_DEV_API_PORT}`;
  }

  const { protocol, hostname, origin } = window.location;

  if (LOCAL_HOSTNAMES.has(hostname)) {
    return `${protocol}//${hostname}:${DEFAULT_DEV_API_PORT}`;
  }

  return origin;
}

const configuredApiBaseUrl = trimTrailingSlash(import.meta.env.VITE_API_BASE_URL ?? '');
const configuredSocketUrl = trimTrailingSlash(import.meta.env.VITE_SOCKET_URL ?? '');

export const API_BASE_URL = configuredApiBaseUrl || `${getFallbackOrigin()}/api`;
export const SOCKET_URL = configuredSocketUrl || getFallbackOrigin();
export const HEALTH_URL = `${API_BASE_URL}/health`;
