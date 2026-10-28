import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.url(),
});

// Expo only inlines process.env.EXPO_PUBLIC_* when it is read literally like this.
// Typed as unknown: process.env is any in CI and string | undefined once Expo generates expo-env.d.ts.
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
