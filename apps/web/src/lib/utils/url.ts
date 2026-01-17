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
