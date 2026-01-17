import { Card, Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui';
import { ThemeSelector } from '@/lib';
import { productName } from '@/lib/constants';
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

      <div className="md:col-span-2">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">General Settings</h3>

          <Field>
            <FieldLabel>Theme</FieldLabel>
            <FieldContent>
              <ThemeSelector />
            </FieldContent>
            <FieldDescription>Change the appearance of {productName}</FieldDescription>
          </Field>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Profile Settings</h3>
          <SettingsForm onSave={handleSave} />
        </Card>
      </div>
    </div>
  );
};
