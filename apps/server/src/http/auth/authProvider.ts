import type { Application } from 'express';
import type { AuthProviderType } from './schema.js';

export abstract class AuthProvider {
  public abstract type: AuthProviderType;

  public abstract initialize: (app: Application) => Promise<void> | void;

  public abstract shutdown: () => Promise<void> | void;

  /**
   * Invoked by the HTTPServer after it loaded all the routes.
   * Used to load error handlers after the routes.
   */
  public onPostInitialize: (app: Application) => Promise<void> | void = () => {};
}
