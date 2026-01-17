import { getWebSocketUrl } from './utils';

export const productName = 'Boilerplate';
export const productNameSlug = 'boilerplate-typescript-fullstack';
export const productVersion = import.meta.env.VITE_VERSION;
export const isDev = import.meta.env.DEV === true || productVersion === 'develop';
export const basePath = import.meta.env.BASE_URL ?? '/';
export const isHashBasedRouting =
  import.meta.env.VITE_HASH_ROUTER_ENABLED === 'true' || basePath !== '/';
export const settingsLocalStorageBaseKey = `${productNameSlug}.settings`;
export const settingsMetaLocalStorageBaseKey = `${productNameSlug}._meta`;

export const githubUrl = `https://github.com/KennethWussmann/${productName}`;
export const legalUrl = 'https://kenneth.wussmann.net/imprint/';
export const privacyPolicyUrl = 'https://kenneth.wussmann.net/privacy/';

export const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN ?? null;
export const plausibleEndpoint = import.meta.env.VITE_PLAUSIBLE_ENDPOINT ?? null;

export const defaultApiUrl = 'http://localhost:8080/graphql';
export const httpApiUrl = import.meta.env.VITE_HTTP_API_URL ?? defaultApiUrl;
export const wsApiUrl = import.meta.env.VITE_WS_API_URL || getWebSocketUrl(httpApiUrl);
export const isApiEnabled = import.meta.env.VITE_API_ENABLED !== 'false';

export const config = {
  productName,
  productNameSlug,
  productVersion,
  isDev,
  basePath,
  isHashBasedRouting,
  settingsLocalStorageBaseKey,
  settingsMetaLocalStorageBaseKey,
  githubUrl,
  legalUrl,
  privacyPolicyUrl,
  plausibleDomain,
  plausibleEndpoint,
  defaultApiUrl,
  httpApiUrl,
  wsApiUrl,
  isApiEnabled,
};

console.log('Config', { config });
