import type { NextFunction, Request, Response } from 'express';
import type { Configuration } from '../config/index.js';

export type UserContext = {
  username: string;
  email?: string;
  name?: string;
  groups?: string[];
};

declare global {
  namespace Express {
    interface Request {
      user?: UserContext;
    }
  }
}

const isRouteProtected = (path: string, protectedRoutes: string[]): boolean => {
  if (protectedRoutes.length === 0) {
    return true;
  }
  return protectedRoutes.some((route) => path.startsWith(route));
};

export const createAuthMiddleware = (config: Configuration) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const headers = config.auth.headers;
    const username = req.get(headers.user);
    const email = req.get(headers.email);
    const name = req.get(headers.name);
    const groupsHeader = req.get(headers.groups);

    if (username) {
      req.user = {
        username,
        email,
        name,
        groups: groupsHeader ? groupsHeader.split(',').map((g) => g.trim()) : undefined,
      };
    }

    const requiresAuth = isRouteProtected(req.path, config.auth.protected_routes);

    if (requiresAuth && !req.user) {
      res.status(401).json({
        success: false,
        error: 'Access denied',
      });
      return;
    }

    next();
  };
};
