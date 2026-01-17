export const getPlatform = () => {
  const userAgent = window.navigator.userAgent;
  let os: 'macOS' | 'iOS' | 'Windows' | 'Android' | 'Linux' | null = null;

  const isIOS =
    /iPad|iPhone|iPod/.test(userAgent) ||
    (/Mac|Mac OS|MacIntel/gi.test(userAgent) &&
      (navigator.maxTouchPoints > 1 || 'ontouchend' in document));

  if (/Macintosh|macOS|Mac|Mac OS|MacIntel|MacPPC|Mac68K/gi.test(userAgent)) {
    os = 'macOS';
  } else if (isIOS) {
    os = 'iOS';
  } else if (/'Win32|Win64|Windows|Windows NT|WinCE/gi.test(userAgent)) {
    os = 'Windows';
  } else if (/Android/gi.test(userAgent)) {
    os = 'Android';
  } else if (/Linux/gi.test(userAgent)) {
    os = 'Linux';
  }

  return os;
};
export const isMacOS = () => getPlatform() === 'macOS';

export const isTouchDevice = () => {
  const platform = getPlatform();
  return platform === 'iOS' || platform === 'Android';
};
