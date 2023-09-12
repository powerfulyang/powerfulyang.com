import { dirname, join } from 'node:path';
import SwaggerParser from '@apidevtools/swagger-parser';
import { beforeAll, describe, expect, it } from '@jest/globals';
import type { OpenAPIV2 } from 'openapi-types';
import { convertV2SchemaToCode } from '@/services/swagger-parse/convertV2SchemaToCode';
import { getSchema } from '@/services/swagger-parse/getSchema';
import { generateTableCode } from '@/services/swagger-parse/generateTableCode';

describe('swagger parse v2', () => {
  let doc: OpenAPIV2.Document;

  beforeAll(async () => {
    const __dirname = dirname(import.meta.url);
    const swagger = join(__dirname, 'v2.json');
    doc = (await SwaggerParser.parse(swagger)) as OpenAPIV2.Document;
  });

  it('getSchema with no field parameters', () => {
    const schema = getSchema(doc, 'QueryAgentAuthSpuResponse');
    expect(schema).toHaveProperty(['properties', 'total', 'type'], 'integer');
  });

  it('getSchema with string field parameters', () => {
    const schema = getSchema(doc, 'QueryAgentAuthSpuResponse', 'list');
    expect(schema).toHaveProperty(['properties', 'id', 'type'], 'integer');
  });

  it('getSchema with array field parameters#1', () => {
    const schema_AgentAuthSpuDto_skus_id = getSchema(doc, 'QueryAgentAuthSpuResponse', [
      'list',
      'skus',
      'id',
    ]);
    expect(schema_AgentAuthSpuDto_skus_id).toHaveProperty(['type'], 'integer');
  });

  it('convert', () => {
    const res = convertV2SchemaToCode(doc, 'ModifyTenantLowestSaleDiscountRequest');
    expect(res).toContainEqual({
      dataIndex: 'tenancyCode',
      title: '租户ID',
    });
  });

  it('generateTableCode', () => {
    const res = generateTableCode(doc, {
      url: '/v1/auth/query_auth',
      fieldPath: 'list',
    });
    expect(res).toContainEqual({
      dataIndex: 'id',
    });
  });
});
