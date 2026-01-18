import { httpApiUrl, settingsLocalStorageBaseKey, wsApiUrl } from '../constants';
import { stripQuotes } from '../utils';

export const deriveWebSocketUrl = (apiUrl: string): string => {
  if (apiUrl.startsWith('/')) {
    if (typeof window === 'undefined') {
      return `ws://localhost:8080${apiUrl}`;
    }
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}${apiUrl}`;
  }
  return apiUrl.replace(/^http/, 'ws');
};

const ensureGraphqlPath = (url: string): string => {
  return url.endsWith('/graphql') ? url : `${url}/graphql`;
};

const getSettingsValue = (key: string, defaultValue: string): string => {
  try {
    const value = localStorage.getItem(key);
    if (value) {
      return stripQuotes(value);
    }
  } catch {}
  return defaultValue;
};

export const getHttpApiUrl = () => {
  const url = getSettingsValue(`${settingsLocalStorageBaseKey}.backend.httpUrl`, httpApiUrl);
  return ensureGraphqlPath(url);
};
export const getWsApiUrl = () => {
  const url = getSettingsValue(
    `${settingsLocalStorageBaseKey}.backend.wsUrl`,
    wsApiUrl ?? deriveWebSocketUrl(getHttpApiUrl())
  );
  return ensureGraphqlPath(url);
};
export const isApiEnabled = () => {
  const enabled = getSettingsValue(
    `${settingsLocalStorageBaseKey}.backend.enabled`,
    String(import.meta.env.VITE_API_ENABLED !== 'false')
  );
  return enabled.toLowerCase().trim() === 'true';
};
