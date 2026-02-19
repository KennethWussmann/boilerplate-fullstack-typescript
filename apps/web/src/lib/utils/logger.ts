import { isDev } from '../constants';

export const debug = (message: string, ...opts: unknown[]) => {
  if (isDev) {
    console.log(message, ...opts);
  }
};
