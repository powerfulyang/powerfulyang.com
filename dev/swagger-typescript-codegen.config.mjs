import { generateApi } from 'swagger-typescript-api';
import { join } from 'node:path';

const swaggerOrigin = process.env.SWAGGER_ORIGIN;

await generateApi({
  name: 'api',
  output: join(process.cwd(), 'src', '__generated__'),
  url: `${swaggerOrigin}/api/swagger-json`,
  cleanOutput: true,
  httpClientType: 'fetch',
  extractEnums: true,
});
