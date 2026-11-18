import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.url(),
});

const rawEnv: Record<string, unknown> = {
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
};
const parsedEnv = envSchema.safeParse(rawEnv);
if (!parsedEnv.success) {
  throw new Error(
    `Invalid environment variables:\n${z.prettifyError(parsedEnv.error)}`,
  );
}

export const env = {
  apiUrl: parsedEnv.data.EXPO_PUBLIC_API_URL,
};
