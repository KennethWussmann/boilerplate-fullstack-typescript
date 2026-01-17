import { GeneralSettingsCard } from './general-settings';
import { ProfileSettingsCard } from './profile-settings';
import { ShortcutsCard } from './shortcuts';

export const SettingsView = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">
          Manage your application preferences and configuration
        </p>
      </div>

      <div className="md:col-span-2">
        <GeneralSettingsCard />
      </div>

      <div className="md:col-span-2">
        <ProfileSettingsCard />
      </div>

      <div className="md:col-span-2">
        <ShortcutsCard />
      </div>
    </div>
  );
};
