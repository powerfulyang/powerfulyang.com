import { convertV3SchemaToCode } from '@/services/swagger-parse/convertV3SchemaToCode';
import { getSchemaName } from '@/services/swagger-parse/getSchemaName';
import { generateTableFromPath } from '@/services/swagger-parse/index';
import SwaggerParser from '@apidevtools/swagger-parser';
import { beforeAll, describe, expect, it } from '@jest/globals';
import { join } from 'node:path';
import type { OpenAPIV3 } from 'openapi-types';

describe('swagger parse', () => {
  let doc: OpenAPIV3.Document;

  beforeAll(async () => {
    const swagger = join(__dirname, 'v3.json');
    doc = (await SwaggerParser.parse(swagger)) as OpenAPIV3.Document;
  });

  it('getSchemaName', () => {
    const e = getSchemaName('#/components/schemas/User');
    expect(e).toBe('User');
  });

  it('convert', () => {
    const res = convertV3SchemaToCode(doc, 'User');
    expect(res).toBeDefined();
  });

  it('generateTableFromPath', () => {
    const res = generateTableFromPath(doc, '/api/user/current', 'get');
    expect(res).toBeDefined();
  });
});
