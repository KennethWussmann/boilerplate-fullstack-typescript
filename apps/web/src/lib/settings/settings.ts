import { atomWithStorage } from 'jotai/utils';
import { createStore } from 'jotai/vanilla';
import {
  isDev,
  productVersion,
  settingsLocalStorageBaseKey,
  settingsMetaLocalStorageBaseKey,
} from '../constants';

export const settingsStore = createStore();

export const settings = {
  // Toggles are usually off by default and flipped on exactly once. Used for dismissable alerts for example
  toggles: {
    onboardingCompleted: atomWithStorage<boolean>(
      `${settingsLocalStorageBaseKey}.toggles.onboardingCompleted`,
      false,
      undefined,
      {
        getOnInit: true,
      }
    ),
  },
  featureToggles: {
    developerTools: atomWithStorage(
      `${settingsLocalStorageBaseKey}.featureToggles.developerTools`,
      isDev
    ),
  },
  analytics: {
    enabled: atomWithStorage<boolean>(
      `${settingsLocalStorageBaseKey}.analytics.enabled`,
      false,
      undefined,
      {
        getOnInit: true,
      }
    ),
    // iso8601
    dismissConsentBannerUntil: atomWithStorage<string | undefined>(
      `${settingsLocalStorageBaseKey}.analytics.dismissConsentBannerUntil`,
      undefined,
      undefined,
      {
        getOnInit: true,
      }
    ),
  },
  appearance: {
    theme: atomWithStorage(`${settingsLocalStorageBaseKey}.appearance.theme`, 'system'),
  },
  shortcuts: {
    openDevTools: atomWithStorage(`${settingsLocalStorageBaseKey}.shortcuts.openDevTools`, 'f1'),
    openSettings: atomWithStorage(
      `${settingsLocalStorageBaseKey}.shortcuts.openSettings`,
      'mod+comma'
    ),
  },
} as const;

export type Settings = typeof settings;
export type Shortcut = keyof Settings['shortcuts'];
export type FeatureToggle = keyof Settings['featureToggles'];

export const resetLocalStorage = (mode: 'application' | 'all' = 'application') => {
  for (const key in localStorage) {
    const isAppKey = key.startsWith(settingsLocalStorageBaseKey);
    if (isAppKey || mode === 'all') {
      localStorage.removeItem(key);
    }
  }
};

export const exportLocalStorageToJSON = () => {
  const data: Record<string, string> = {
    [`${settingsMetaLocalStorageBaseKey}.version`]: productVersion,
    [`${settingsMetaLocalStorageBaseKey}.timestamp`]: new Date().toISOString(),
  };
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const isAppKey = key?.startsWith(settingsLocalStorageBaseKey);
    if (key && isAppKey) {
      data[key] = localStorage.getItem(key) ?? '';
    }
  }
  return JSON.stringify(data, null, 2);
};

export const importLocalStorageFromJSON = (json: string, mode: 'merge' | 'replace' = 'replace') => {
  const data = JSON.parse(json);

  if (!data['_meta.version']) {
    throw new Error('Invalid JSON file');
  }

  if (mode === 'replace') {
    resetLocalStorage();
  }

  for (const key in data) {
    if (key.startsWith(settingsLocalStorageBaseKey)) {
      localStorage.setItem(key, data[key]);
    }
  }
};
