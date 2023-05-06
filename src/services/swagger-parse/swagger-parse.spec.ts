import {
  convertSchemaToCode,
  generateTableFromPath,
  getSchemaDefinitions,
} from '@/services/swagger-parse/index';
import SwaggerParser from '@apidevtools/swagger-parser';
import { beforeAll, describe, expect, it } from '@jest/globals';
import { join } from 'node:path';
import type { OpenAPIV3 } from 'openapi-types';

describe('swagger parse', () => {
  let doc: OpenAPIV3.Document;

  beforeAll(async () => {
    const swagger = join(__dirname, 'sample.json');
    doc = (await SwaggerParser.parse(swagger)) as OpenAPIV3.Document;
  });

  it('backend api', () => {
    const e = getSchemaDefinitions(doc, 'User');
    expect(e).toBeDefined();
  });

  it('convert', () => {
    const res = convertSchemaToCode(doc, 'User');
    expect(res).toBeDefined();
  });

  it('generateTableFromPath', () => {
    const res = generateTableFromPath(doc, '/api/user/current', 'get');
    expect(res).toBeDefined();
  });
});
