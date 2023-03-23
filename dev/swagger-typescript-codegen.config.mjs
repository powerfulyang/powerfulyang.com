import { generateApi } from 'swagger-typescript-api';
import * as path from 'node:path';

await generateApi({
  name: 'api',
  output: path.join(process.cwd(), 'src', '__generated__'),
  url: 'https://local.powerfulyang.com/api/swagger-json',
  cleanOutput: true,
  extractEnums: true,
});
