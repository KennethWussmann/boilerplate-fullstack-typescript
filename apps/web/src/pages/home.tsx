import { Text } from '@/components/common/typography';

export const Home = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Text variant="p">
        <Text variant="h1">Hello World!</Text>
        <Text variant="lead">This is an example application</Text>
      </Text>
    </div>
  );
};
