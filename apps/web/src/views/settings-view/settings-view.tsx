import { Card } from '@/components/ui';
import { SettingsForm } from './settings-form';

export const SettingsView = () => {
  const handleSave = (data: { serverName: string; enableNotifications: boolean }) => {
    console.log('Settings saved:', data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">
          Manage your application preferences and configuration
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">General Settings</h3>
            <SettingsForm onSave={handleSave} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-2 text-sm font-semibold">GraphQL Integration</h3>
            <p className="text-sm text-muted-foreground">
              In a real application, the form submission would trigger a GraphQL mutation using
              Apollo Client's useMutation hook.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
