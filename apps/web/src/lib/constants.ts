import { getWebSocketUrl } from './utils';

export const productName = 'Boilerplate';
export const productNameSlug = 'boilerplate-typescript-fullstack';
export const productVersion = import.meta.env.VERSION;
export const isDev = productVersion === 'develop';
export const basePath = import.meta.env.BASE_URL ?? '/';
export const isHashBasedRouting = basePath !== '/';
export const settingsLocalStorageBaseKey = `${productNameSlug}.settings`;
export const settingsMetaLocalStorageBaseKey = `${productNameSlug}._meta`;

export const githubUrl = `https://github.com/KennethWussmann/${productName}`;
export const legalUrl = 'https://kenneth.wussmann.net/imprint/';
export const privacyPolicyUrl = 'https://kenneth.wussmann.net/privacy/';

export const plausibleDomain = import.meta.env.PLAUSIBLE_DOMAIN ?? null;
export const plausibleEndpoint = import.meta.env.PLAUSIBLE_ENDPOINT ?? null;

export const defaultApiUrl = 'http://localhost:8080/graphql';
export const httpApiUrl = import.meta.env.HTTP_API_URL ?? defaultApiUrl;
export const wsApiUrl = import.meta.env.WS_API_URL || getWebSocketUrl(httpApiUrl);
export const isApiEnabled = import.meta.env.API_ENABLED !== 'false';
