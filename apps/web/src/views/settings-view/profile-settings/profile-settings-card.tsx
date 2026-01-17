import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { ProfileSettingsForm } from './profile-settings-form';

export const ProfileSettingsCard = () => {
  const handleSave = (data: { serverName: string; enableNotifications: boolean }) => {
    console.log('Settings saved:', data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <ProfileSettingsForm onSave={handleSave} />
      </CardContent>
    </Card>
  );
};
