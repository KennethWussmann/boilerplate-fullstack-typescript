import { useDevMode } from '@/components/common/dev-tools';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  Switch,
} from '@/components/ui';
import { ThemeSelector } from '@/lib';
import { productName } from '@/lib/constants';

export const GeneralSettingsCard = () => {
  const { isDev, setDev } = useDevMode();
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-8 items-center">
        <Field>
          <FieldLabel>Theme</FieldLabel>
          <FieldContent>
            <ThemeSelector />
          </FieldContent>
          <FieldDescription>Change the appearance of {productName}</FieldDescription>
        </Field>
        <Field orientation="horizontal">
          <div className="flex-1 space-y-1">
            <FieldLabel htmlFor="developer-mode">Enable Developer Mode</FieldLabel>
            <FieldDescription className="max-w-[700px]">
              The developer mode unlocks a few hidden features and menus meant for debugging and
              development of {productName}. Use them at your own risk.
            </FieldDescription>
          </div>
          <Switch
            id={'developer-mode'}
            name={'developer-mode'}
            checked={isDev}
            onCheckedChange={(checked) => {
              setDev(checked);
            }}
          />
        </Field>
      </CardContent>
    </Card>
  );
};
