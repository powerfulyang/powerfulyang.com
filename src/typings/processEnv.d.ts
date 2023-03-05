declare namespace NodeJS {
  interface ProcessEnv {
    CLIENT_BASE_HOST: string;
    SERVER_BASE_URL: string;

    NEXT_PUBLIC_SENTRY_DSN: string;
    NEXT_PUBLIC_GA_ID: string;
  }
}
