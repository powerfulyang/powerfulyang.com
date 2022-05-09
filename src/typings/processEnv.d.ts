declare namespace NodeJS {
  interface ProcessEnv {
    CLIENT_BASE_HOST: string;
    SERVER_BASE_URL: string;

    API_ENV: string;
    NEXT_PUBLIC_SENTRY_DSN: string;
  }
}
