import { convertV3SchemaToCode } from '@/services/swagger-parse/convertV3SchemaToCode';
import { generateTableFromPath } from '@/services/swagger-parse/index';
import SwaggerParser from '@apidevtools/swagger-parser';
import { beforeAll, describe, expect, it } from '@jest/globals';
import { join } from 'node:path';
import type { OpenAPIV3 } from 'openapi-types';
import { getSchema } from '@/services/swagger-parse/getSchema';

describe('swagger parse v3', () => {
  let doc: OpenAPIV3.Document;

  beforeAll(async () => {
    const swagger = join(__dirname, 'v3.json');
    doc = (await SwaggerParser.parse(swagger)) as OpenAPIV3.Document;
  });

  it('getSchema', () => {
    const schema = getSchema(doc, 'User');
    expect(schema).toHaveProperty(['properties', 'id', 'type'], 'number');
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
