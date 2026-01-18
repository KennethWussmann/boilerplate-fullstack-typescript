import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useDevMode } from '@/components/common/dev-tools';
import { Input } from '@/components/ui';
import type { Shortcut } from '@/lib/settings';
import { getAllShortcuts, getShortcutMetadata } from '@/lib/shortcuts';
import { ShortcutsTableRow } from './shortcuts-table-row';

const fuzzyMatch = (text: string, query: string): boolean => {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  let queryIndex = 0;
  for (let i = 0; i < lowerText.length && queryIndex < lowerQuery.length; i++) {
    if (lowerText[i] === lowerQuery[queryIndex]) {
      queryIndex++;
    }
  }
  return queryIndex === lowerQuery.length;
};

const matchesSearch = (shortcut: Shortcut, query: string): boolean => {
  if (!query.trim()) return true;
  const metadata = getShortcutMetadata(shortcut);
  return fuzzyMatch(metadata.name, query) || fuzzyMatch(metadata.description, query);
};

export const ShortcutsTable = () => {
  const { isDev } = useDevMode();
  const [searchQuery, setSearchQuery] = useState('');
  const allShortcuts = getAllShortcuts();

  const filteredShortcuts = useMemo(
    () =>
      allShortcuts
        .filter((shortcutKey) => matchesSearch(shortcutKey, searchQuery))
        .filter((shortcutKey) => getShortcutMetadata(shortcutKey).devOnly !== true || isDev),
    [allShortcuts, searchQuery, isDev]
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search shortcuts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="divide-y">
        {filteredShortcuts.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground text-sm">
            No shortcuts found matching "{searchQuery}"
          </div>
        ) : (
          filteredShortcuts.map((shortcut) => (
            <ShortcutsTableRow key={shortcut} shortcut={shortcut} />
          ))
        )}
      </div>
    </div>
  );
};
