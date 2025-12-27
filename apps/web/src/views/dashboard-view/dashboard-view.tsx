import { useQuery, useSubscription } from '@apollo/client/react';
import { Activity, Server, Zap } from 'lucide-react';
import { LoadingState, MetricCard, StatusIndicator } from '@/components/common';
import { graphql } from '@/lib/graphql';

const HEALTH_QUERY = graphql(`
  query GetServerHealth {
    health {
      status
      timestamp
    }
  }
`);

const HEALTH_SUBSCRIPTION = graphql(`
  subscription OnServerHealthChange {
    health {
      status
      timestamp
    }
  }
`);

export const DashboardView = () => {
  const { data: queryData, loading } = useQuery(HEALTH_QUERY, {
    pollInterval: 5000,
  });

  const { data: subscriptionData } = useSubscription(HEALTH_SUBSCRIPTION);

  const healthData = subscriptionData?.health || queryData?.health;

  if (loading && !healthData) {
    return <LoadingState message="Loading dashboard..." />;
  }

  const isOnline = healthData?.status === 'ONLINE';
  const statusType = isOnline ? 'online' : 'offline';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">
          Monitor your application's health and performance metrics
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Server Status</h3>
            <p className="text-sm text-muted-foreground">Real-time via GraphQL subscription</p>
          </div>
          <StatusIndicator status={statusType} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Server Status"
          value={healthData?.status || 'Unknown'}
          icon={Server}
          description="Current operational status"
        />
        <MetricCard
          title="GraphQL API"
          value="Active"
          icon={Zap}
          description="Queries & subscriptions working"
        />
        <MetricCard
          title="Last Update"
          value={
            healthData?.timestamp
              ? new Date(String(healthData.timestamp)).toLocaleTimeString()
              : 'N/A'
          }
          icon={Activity}
          description="Latest health check"
        />
      </div>
    </div>
  );
};
