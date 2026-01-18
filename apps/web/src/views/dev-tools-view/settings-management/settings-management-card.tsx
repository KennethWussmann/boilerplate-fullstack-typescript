import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components';
import { DoubleConfirmationDialog } from '@/components/common/double-confirmation-dialog';
import {
  exportLocalStorageToJSON,
  importLocalStorageFromJSON,
  productName,
  resetLocalStorage,
} from '@/lib';
import { SettingsTable } from './settings-table';

export const SettingsManagementCard = () => {
  const selectFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (event) => {
        const json = event.target?.result as string;
        try {
          importLocalStorageFromJSON(json);
          document.location.reload();
        } catch {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };
  const startDownload = () => {
    const json = exportLocalStorageToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${productName}-settings_${new Date().toISOString()}.json`;
    a.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings Management</CardTitle>
        <CardDescription>Manage the settings of the client</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-wrap justify-between gap-8">
          <div className="flex gap-2">
            <DoubleConfirmationDialog message="All your current settings will be overwritten and the page will reload after import.">
              <Button variant="destructive" onClick={selectFile}>
                Import from file
              </Button>
            </DoubleConfirmationDialog>
            <Button variant="secondary" onClick={startDownload}>
              Download
            </Button>
          </div>
          <div className="flex gap-2">
            <DoubleConfirmationDialog message="This will clear all current settings if this application in local storage.">
              <Button variant="destructive" onClick={() => resetLocalStorage('application')}>
                Clear App Settings
              </Button>
            </DoubleConfirmationDialog>
            <DoubleConfirmationDialog message="This will clear all local storage also potentially keys that don't belong to this application.">
              <Button variant="destructive" onClick={() => resetLocalStorage('all')}>
                Clear all Local Storage
              </Button>
            </DoubleConfirmationDialog>
          </div>
        </div>
        <SettingsTable />
      </CardContent>
    </Card>
  );
};
