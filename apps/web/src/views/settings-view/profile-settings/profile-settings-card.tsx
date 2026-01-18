import { BadgeInfo } from 'lucide-react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui';
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
        <Alert className="mb-4">
          <BadgeInfo />
          <AlertTitle>Demo Form</AlertTitle>
          <AlertDescription>
            This settings form is using @tanstack/react-form to demonstrate complete forms. It can
            safely be removed if no longer needed or repurposed to persist settings to the backend.
          </AlertDescription>
        </Alert>
        <ProfileSettingsForm onSave={handleSave} />
      </CardContent>
    </Card>
  );
};
