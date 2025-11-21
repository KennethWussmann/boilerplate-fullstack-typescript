export const buildUrl = (base: string, path: string): string => {
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return normalizedBase + normalizedPath;
};
