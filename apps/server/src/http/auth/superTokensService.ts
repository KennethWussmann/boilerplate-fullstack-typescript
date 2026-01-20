import type { Application } from 'express';
import supertokens from 'supertokens-node';
import { errorHandler, middleware } from 'supertokens-node/framework/express';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Session from 'supertokens-node/recipe/session';
import type { Logger } from 'winston';
import { ApplicationConfigurationError } from '@/error/error.js';
import type { Configuration } from '../../config/index.js';
import { AuthProvider } from './authProvider.js';
import type { AuthProviderType } from './schema.js';

export class SuperTokensService extends AuthProvider {
  public type: AuthProviderType = 'supertokens';

  constructor(
    private readonly logger: Logger,
    private readonly config: Configuration
  ) {
    super();
  }

  public initialize = async (app: Application) => {
    if (!this.config.api.auth.supertokens) {
      throw new ApplicationConfigurationError(
        'Authentication via SuperTokens is enabled, but SuperTokens configuration is missing.'
      );
    }

    if (!this.config.api.cors_enabled) {
      throw new ApplicationConfigurationError(
        'CORS is disabled, but required for SuperTokens to work.'
      );
    }

    supertokens.init({
      supertokens: {
        connectionURI: this.config.api.auth.supertokens.connection_url,
        apiKey: this.config.api.auth.supertokens.api_key,
      },
      appInfo: {
        apiDomain: this.config.api.auth.supertokens.api_domain,
        appName: this.config.api.auth.supertokens.app_name,
        websiteDomain: this.config.api.auth.supertokens.website_domain,
      },
      recipeList: [EmailPassword.init(), Session.init()],
    });

    app.use(middleware);
    this.logger.info('Initialized authentication against SuperTokens');
  };

  public shutdown = async () => {};

  public override onPostInitialize = (app: Application) => {
    app.use(errorHandler());
  };
}
