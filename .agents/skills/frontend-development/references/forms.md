# Forms: TanStack Form + Zod + Field components

Every form uses TanStack Form for state, Zod for validation, and the `Field` primitives from `@/components/ui` for markup. Hand-rolled `useState` forms drift on validation timing, error display and accessibility, which is exactly the boring work these three already solved.

`apps/web/src/views/settings-view/profile-settings/profile-settings-form.tsx` is the working example in this repository. Read it — matching an existing file beats matching a snippet.

## Ask first

- **Fields**: names, types, validation rules, dynamic or array fields?
- **Validation timing**: on submit, on blur, on change?
- **Create or edit**: are there default values to load first?
- **Submission**: which mutation, and what happens after — redirect, close dialog, toast, reset?

## The shape

```typescript
import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { Button, Field, FieldDescription, FieldError, FieldGroup, FieldLabel, Input } from '@/components/ui';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
});

export const CreateItemForm = ({ onComplete }: CreateItemFormProps) => {
  const [createItem] = useMutation(CreateItemMutation);

  const form = useForm({
    defaultValues: { title: '' },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      try {
        await createItem({ variables: { input: value } });
        toast.success('Item created');
        onComplete?.();
      } catch {
        toast.error('Failed to create item');
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-4"
    >
      <FieldGroup>
        <form.Field name="title">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
                <FieldDescription>A short, descriptive title.</FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      <form.Subscribe selector={(state) => [state.isSubmitting]}>
        {([isSubmitting]) => (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
};
```

Three details carry more weight than they look:

- **`isInvalid` gates the error display.** Showing errors before a field is touched means a pristine form greets the user in red.
- **`data-invalid` on `<Field>` and `aria-invalid` on the control.** The first drives the error styling, the second is what a screen reader announces. Both, always.
- **`form.Subscribe` around the submit button** rather than reading `form.state` in the body. Subscribing scopes re-renders to the button instead of re-rendering every field on each keystroke.

## Control-specific wiring

The pattern is identical for every control; only the value binding changes.

| Control | Binding |
| --- | --- |
| `Input`, `Textarea` | `value={field.state.value}` + `onChange={(e) => field.handleChange(e.target.value)}` |
| `Select` | `value={field.state.value}` + `onValueChange={field.handleChange}` |
| `Checkbox`, `Switch` | `checked={field.state.value}` + `onCheckedChange={field.handleChange}` |
| `RadioGroup` | `value={field.state.value}` + `onValueChange={field.handleChange}` |

Group related controls in a `FieldSet` with a `FieldLegend` — a checkbox group without one is a pile of loose inputs to anyone not looking at the screen.

## Arrays and dynamic fields

`mode="array"` gives the field `pushValue`, `removeValue` and an indexable value. Nest a `form.Field` per entry with a `name` of `items[0].address`:

```typescript
<form.Field name="emails" mode="array">
  {(field) => (
    <FieldSet>
      <FieldLegend variant="label">Email addresses</FieldLegend>
      {field.state.value.map((_, index) => (
        <form.Field key={index} name={`emails[${index}].address`}>
          {(subField) => (/* standard field markup */)}
        </form.Field>
      ))}
      <Button type="button" variant="outline" onClick={() => field.pushValue({ address: '' })}>
        Add email
      </Button>
    </FieldSet>
  )}
</form.Field>
```

## Validation timing

`validators` accepts `onSubmit`, `onChange` and `onBlur`, and they combine. `onSubmit` alone is the calm default; adding `onBlur` gives feedback as the user leaves each field. `onChange` validates on every keystroke, which is right for a password strength meter and irritating for anything else.

## Editing existing data

Query first, then feed the result into `defaultValues`. Render the form only once the data has arrived — a form mounted with empty defaults keeps them, so the user gets a blank edit form that silently wipes the record on save.

## Errors

Wrap the mutation in try/catch and surface failures with `toast.error`. A form whose submit button spins back to normal with no message reads as "nothing happened" and the user submits again.
