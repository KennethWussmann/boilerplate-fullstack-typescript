import { z } from 'zod';

export const authProviderTypeSchema = z.literal('supertokens');

export type AuthProviderType = z.infer<typeof authProviderTypeSchema>;
