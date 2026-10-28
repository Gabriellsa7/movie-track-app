import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.url(),
});

// Expo only inlines process.env.EXPO_PUBLIC_* when it is read literally like this.
const parsedEnv = envSchema.safeParse({
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL as string | undefined,
});
if (!parsedEnv.success) {
  throw new Error(
    `Invalid environment variables:\n${z.prettifyError(parsedEnv.error)}`,
  );
}

export const env = {
  apiUrl: parsedEnv.data.EXPO_PUBLIC_API_URL,
};
