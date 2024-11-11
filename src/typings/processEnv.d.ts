declare namespace NodeJS {
  interface ProcessEnv {
    SERVER_BASE_URL: string;

    NEXT_PUBLIC_SENTRY_DSN: string;
    NEXT_PUBLIC_GA_ID: string;

    PORT: string;

    JWT_SECRET: string;
  }
}
