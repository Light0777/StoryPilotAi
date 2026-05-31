const requiredEnvVars = [
  "DATABASE_URL",
  "SESSION_SECRET",
] as const;

const optionalEnvVars = [
  "REDIS_URL",
  "R2_ENDPOINT",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
  "R2_PUBLIC_URL",
  "OPENAI_API_KEY",
  "BUFFER_CLIENT_ID",
  "BUFFER_CLIENT_SECRET",
  "BUFFER_ACCESS_TOKEN",
  "IMAGE_PROVIDER",
  "IMAGE_PROVIDER_API_KEY",
  "NEXT_PUBLIC_APP_URL",
] as const;

export function validateEnv(): void {
  const missing: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}. ` +
      "Please check your .env file."
    );
  }
}

export function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

export function getOptionalEnv(key: string, defaultValue: string = ""): string {
  return process.env[key] || defaultValue;
}

export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

export function isRedisConfigured(): boolean {
  return !!process.env.REDIS_URL;
}
