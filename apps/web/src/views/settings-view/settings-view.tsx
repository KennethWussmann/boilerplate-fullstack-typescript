import { DeveloperOnly } from '@/components/common/dev-tools';
import { BackendSettingsCard } from './backend-settings';
import { GeneralSettingsCard } from './general-settings';
import { ProfileSettingsCard } from './profile-settings';
import { ShortcutsCard } from './shortcuts';

export const SettingsView = () => {
  return (
    <div className="space-y-4">
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

      <DeveloperOnly>
        <div className="md:col-span-2">
          <BackendSettingsCard />
        </div>
      </DeveloperOnly>

      <div className="md:col-span-2">
        <ShortcutsCard />
      </div>
    </div>
  );
};
