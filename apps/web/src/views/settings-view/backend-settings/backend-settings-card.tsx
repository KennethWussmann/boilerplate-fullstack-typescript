import { useAtom } from 'jotai';
import { StatusIndicator } from '@/components';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  Input,
  Switch,
} from '@/components/ui';
import { useServerStatus } from '@/lib';
import { settings } from '@/lib/settings/settings';

export const BackendSettingsCard = () => {
  const [enabled, setEnabled] = useAtom(settings.backend.enabled);
  const [httpUrl, setHttpUrl] = useAtom(settings.backend.httpUrl);
  const [wsUrl, setWsUrl] = useAtom(settings.backend.wsUrl);
  const { status } = useServerStatus();

  const onChangeEnabled = (enabled: boolean) => {
    setEnabled(enabled);
    window.location.reload();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between items-center">
          <div>Backend Settings</div> <StatusIndicator status={status} />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-8 items-center">
        <Field orientation="horizontal">
          <div className="flex-1 space-y-1">
            <FieldLabel htmlFor="backend-enabled">Enable Backend API</FieldLabel>
            <FieldDescription className="max-w-[700px]">
              Enable or disable the connection to the backend API server. Change requires refresh.
            </FieldDescription>
          </div>
          <Switch
            id="backend-enabled"
            name="backend-enabled"
            checked={enabled}
            onCheckedChange={onChangeEnabled}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="http-url">HTTP API URL</FieldLabel>
          <FieldContent>
            <Input
              id="http-url"
              name="http-url"
              type="url"
              placeholder="http://localhost:8080"
              value={httpUrl}
              onChange={(e) => setHttpUrl(e.target.value)}
              disabled={!enabled}
            />
          </FieldContent>
          <FieldDescription>The HTTP endpoint for the backend API</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="ws-url">WebSocket API URL</FieldLabel>
          <FieldContent>
            <Input
              id="ws-url"
              name="ws-url"
              type="url"
              placeholder="ws://localhost:8080"
              value={wsUrl}
              onChange={(e) => setWsUrl(e.target.value)}
              disabled={!enabled}
            />
          </FieldContent>
          <FieldDescription>The WebSocket endpoint for real-time subscriptions</FieldDescription>
        </Field>
      </CardContent>
    </Card>
  );
};
