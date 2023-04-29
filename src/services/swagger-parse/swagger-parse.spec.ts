import {
  convertSchemaToCode,
  generateTableFromPath,
  getSchemaDefinitions,
} from '@/services/swagger-parse/index';
import { describe, expect, it } from '@jest/globals';
import { join } from 'node:path';

describe('swagger parse', () => {
  const swagger = join(__dirname, 'sample.json');

  it('backend api', async () => {
    const e = await getSchemaDefinitions(swagger, 'User');
    expect(e).toBeDefined();
  });

  it('convert', async () => {
    const res = await convertSchemaToCode(swagger, 'User');
    expect(res).toBeDefined();
  });

  it('generateTableFromPath', async () => {
    const res = await generateTableFromPath(swagger, '/api/feed', 'post');
    expect(res).toBeDefined();
  });
});
