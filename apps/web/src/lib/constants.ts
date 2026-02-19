import z from 'zod';

export const productName = 'Boilerplate';
export const productNameSlug = 'boilerplate-fullstack-typescript';
export const productVersion = import.meta.env.VITE_VERSION;
export const isDev = import.meta.env.DEV || productVersion === 'develop';
export const basePath = import.meta.env.BASE_URL ?? '/';
export const isHashBasedRouting = z
  .stringbool()
  .default(basePath !== '/')
  .parse(import.meta.env.VITE_HASH_ROUTER_ENABLED);
export const settingsLocalStorageBaseKey = `${productNameSlug}.settings`;
export const settingsMetaLocalStorageBaseKey = `${productNameSlug}._meta`;
// Whether or not to allow any ordinary user to enable developer mode simply via the settings
export const allowPublicDeveloperMode =
  import.meta.env.VITE_ALLOW_PUBLIC_DEVELOPER_MODE === 'true' || isDev;

export const footerEnabled = z
  .stringbool()
  .default(true)
  .parse(import.meta.env.VITE_FOOTER_ENABLED);
export const landingPageEnabled = z
  .stringbool()
  .default(true)
  .parse(import.meta.env.VITE_LANDING_PAGE_ENABLED);
export const githubUrl: string | null = `https://github.com/KennethWussmann/${productNameSlug}`;
export const legalUrl: string | null = 'https://kenneth.wussmann.net/imprint/';
export const privacyPolicyUrl: string | null = 'https://kenneth.wussmann.net/privacy/';

export const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN ?? null;
export const plausibleEndpoint = import.meta.env.VITE_PLAUSIBLE_ENDPOINT ?? null;

export const defaultApiUrl = 'http://localhost:8080/graphql';
export const httpApiUrl = import.meta.env.VITE_HTTP_API_URL ?? defaultApiUrl;
export const wsApiUrl = import.meta.env.VITE_WS_API_URL;

export const config = {
  productName,
  productNameSlug,
  productVersion,
  isDev,
  basePath,
  isHashBasedRouting,
  settingsLocalStorageBaseKey,
  settingsMetaLocalStorageBaseKey,
  footerEnabled,
  landingPageEnabled,
  githubUrl,
  legalUrl,
  privacyPolicyUrl,
  plausibleDomain,
  plausibleEndpoint,
  defaultApiUrl,
  httpApiUrl,
  wsApiUrl,
};
