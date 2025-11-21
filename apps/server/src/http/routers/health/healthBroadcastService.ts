import type { GraphQLPubSub, ServerStatusGQL } from '../index.js';

export class HealthBroadcastService {
  public status: ServerStatusGQL = 'STARTING';
  private broadcastInterval: NodeJS.Timeout | null = null;
  constructor(private readonly pubSub: GraphQLPubSub) {}

  private broadcast = () => {
    this.pubSub.publish('health:updated', {
      status: this.status,
      timestamp: new Date().toISOString(),
    });
  };

  public initialize = async () => {
    this.status = 'ONLINE';
    this.broadcast();
    this.broadcastInterval = setInterval(() => this.broadcast(), 10_000);
  };

  public shutdown = async () => {
    this.status = 'STOPPING';
    this.broadcast();
    if (this.broadcastInterval) {
      clearInterval(this.broadcastInterval);
    }
  };
}
