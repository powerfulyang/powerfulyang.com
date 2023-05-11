import { convertV2SchemaToCode } from '@/services/swagger-parse/convertV2SchemaToCode';
import { generateTableFromPath } from '@/services/swagger-parse/index';
import SwaggerParser from '@apidevtools/swagger-parser';
import { beforeAll, describe, expect, it } from '@jest/globals';
import { join } from 'node:path';
import type { OpenAPIV2 } from 'openapi-types';

describe('swagger parse v2', () => {
  let doc: OpenAPIV2.Document;

  beforeAll(async () => {
    const swagger = join(__dirname, 'v2.json');
    doc = (await SwaggerParser.parse(swagger)) as OpenAPIV2.Document;
  });

  it('convert', () => {
    const res = convertV2SchemaToCode(doc, 'ModifyTenantLowestSaleDiscountRequest');
    expect(res).toBeDefined();
  });

  it('generateTableFromPath', () => {
    const res = generateTableFromPath(doc, '/v1/auth/query_auth', 'post');
    expect(res).toBeDefined();
  });
});
