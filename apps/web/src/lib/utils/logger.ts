import { isDev } from '../constants';

export const debug = (message: string, ...opts: any) => {
  if (isDev) {
    console.log(message, ...opts);
  }
};
