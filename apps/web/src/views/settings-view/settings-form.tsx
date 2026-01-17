import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import * as z from 'zod';
import {
  Button,
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Switch,
} from '@/components/ui';
import { productName } from '@/lib/constants';

const formSchema = z.object({
  serverName: z
    .string()
    .min(3, 'Server name must be at least 3 characters.')
    .max(50, 'Server name must be at most 50 characters.'),
  enableNotifications: z.boolean(),
});

interface SettingsFormProps {
  onSave: (data: { serverName: string; enableNotifications: boolean }) => void;
}

export const SettingsForm = ({ onSave }: SettingsFormProps) => {
  const form = useForm({
    defaultValues: {
      serverName: productName,
      enableNotifications: true,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      onSave(value);
      console.log('Form submitted:', value);
      toast.success('Settings saved successfully!');
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field name="serverName">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Server Name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Enter server name"
                  autoComplete="off"
                />
                <FieldDescription>This name will be displayed in the dashboard</FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="enableNotifications">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field orientation="horizontal" data-invalid={isInvalid}>
                <div className="flex-1 space-y-1">
                  <FieldLabel htmlFor={field.name}>Enable Notifications</FieldLabel>
                  <FieldDescription>
                    Receive real-time notifications about server status
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </div>
                <Switch
                  id={field.name}
                  name={field.name}
                  checked={field.state.value}
                  onCheckedChange={field.handleChange}
                  aria-invalid={isInvalid}
                />
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
        <form.Subscribe selector={(state) => [state.isSubmitting]}>
          {([isSubmitting]) => (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
};
