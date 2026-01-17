import {
  init,
  type PlausibleEventOptions,
  track as plausibleTrack,
} from '@plausible-analytics/tracker';
import {
  isDev,
  isHashBasedRouting,
  plausibleDomain,
  plausibleEndpoint,
  settingsLocalStorageBaseKey,
} from '@/lib';

let initialized = false;

export const isAnalyticsEnabled = () => {
  const enabledStr = localStorage.getItem(`${settingsLocalStorageBaseKey}.analytics.enabled`);
  return enabledStr ? (JSON.parse(enabledStr) as boolean) : false;
};

export const initializeAnalytics = () => {
  if (!isAnalyticsEnabled()) {
    return;
  }

  if (initialized) {
    return;
  }

  if (!plausibleDomain || !plausibleEndpoint) {
    return;
  }

  if (isDev) {
    console.log('Plausible tracking would get enabled now, but not during development');
    return;
  }

  init({
    domain: plausibleDomain,
    endpoint: plausibleEndpoint,
    hashBasedRouting: isHashBasedRouting,
  });

  initialized = true;
};

export const track = (eventName: string, options?: PlausibleEventOptions) => {
  if (!initialized || !isAnalyticsEnabled()) {
    return;
  }

  if (isDev) {
    console.log('Would track event', eventName, options);
    return;
  }

  plausibleTrack(eventName, options ?? {});
};
