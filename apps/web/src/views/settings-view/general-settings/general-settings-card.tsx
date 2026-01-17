import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui';
import { ThemeSelector } from '@/lib';
import { productName } from '@/lib/constants';

export const GeneralSettingsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Field>
          <FieldLabel>Theme</FieldLabel>
          <FieldContent>
            <ThemeSelector />
          </FieldContent>
          <FieldDescription>Change the appearance of {productName}</FieldDescription>
        </Field>
      </CardContent>
    </Card>
  );
};
