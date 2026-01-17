export const productName = 'Boilerplate';
export const productNameSlug = 'boilerplate-typescript-fullstack';
export const productVersion = import.meta.env.VERSION;
export const isDev = import.meta.env.VERSION === 'develop';
export const basePath = import.meta.env.BASE_URL ?? '/';
export const isHashBasedRouting = basePath !== '/';
export const settingsLocalStorageBaseKey = `${productNameSlug}.settings`;
export const settingsMetaLocalStorageBaseKey = `${productNameSlug}._meta`;

export const githubUrl = `https://github.com/KennethWussmann/${productName}`;
export const legalUrl = 'https://kenneth.wussmann.net/imprint/';
export const privacyPolicyUrl = 'https://kenneth.wussmann.net/privacy/';

export const DEFAULT_API_URL = 'http://localhost:8080/graphql';

export const getWebSocketUrl = (apiUrl: string): string => {
  if (apiUrl.startsWith('/')) {
    if (typeof window === 'undefined') {
      return `ws://localhost:8080${apiUrl}`;
    }
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}${apiUrl}`;
  }
  return apiUrl.replace(/^http/, 'ws');
};
