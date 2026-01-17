import { useMemo, useSyncExternalStore } from 'react';
import { settingsLocalStorageBaseKey } from '@/lib/constants';
import { SettingsTableRow } from './settings-table-row';

type StorageEntry = {
  key: string;
  value: string;
};

const getStorageEntries = (): StorageEntry[] => {
  const entries: StorageEntry[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(settingsLocalStorageBaseKey)) {
      entries.push({
        key,
        value: localStorage.getItem(key) ?? '',
      });
    }
  }
  return entries.sort((a, b) => a.key.localeCompare(b.key));
};

const subscribe = (callback: () => void) => {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
};

const getSnapshot = () => JSON.stringify(getStorageEntries());

export const SettingsTable = () => {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot);
  const entries = useMemo(() => JSON.parse(snapshot) as StorageEntry[], [snapshot]);

  const handleDelete = (key: string) => {
    localStorage.removeItem(key);
    window.dispatchEvent(new StorageEvent('storage'));
  };

  if (entries.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground text-sm">
        No settings found in local storage
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 py-2 text-xs font-medium text-muted-foreground border-b">
        <div className="flex-1">Key</div>
        <div className="flex-1">Value</div>
        <div className="w-6" />
      </div>
      {entries.map((entry) => (
        <SettingsTableRow
          key={entry.key}
          storageKey={entry.key}
          value={entry.value}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};
