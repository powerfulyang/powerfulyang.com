declare namespace NodeJS {
  interface ProcessEnv {
    CLIENT_BASE_HOST: string;
    SERVER_BASE_URL: string;

    NEXT_PUBLIC_SENTRY_DSN: string;
    NEXT_PUBLIC_GA_ID: string;

    NEXT_PUBLIC_FFMPEG_VERSION: string;
    NEXT_PUBLIC_ONIGASM_VERSION: string;

    PORT: string;

    JWT_SECRET: string;
  }
}
