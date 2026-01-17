import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { ShortcutsTable } from './shortcuts-table';

export const ShortcutsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Keyboard Shortcuts</CardTitle>
      </CardHeader>
      <CardContent>
        <ShortcutsTable />
      </CardContent>
    </Card>
  );
};
