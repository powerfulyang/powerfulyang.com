import { convertV3SchemaToCode } from '@/services/swagger-parse/convertV3SchemaToCode';
import SwaggerParser from '@apidevtools/swagger-parser';
import { beforeAll, describe, expect, it } from '@jest/globals';
import { join } from 'node:path';
import type { OpenAPIV3 } from 'openapi-types';
import { getSchema } from '@/services/swagger-parse/getSchema';
import { generateTableCode } from '@/services/swagger-parse/generateTableCode';

describe('swagger parse v3', () => {
  let doc: OpenAPIV3.Document;

  beforeAll(async () => {
    const swagger = join(__dirname, 'v3.json');
    doc = (await SwaggerParser.parse(swagger)) as OpenAPIV3.Document;
  });

  it('getSchema with no field parameters', () => {
    const user_schema = getSchema(doc, 'User');
    expect(user_schema).toHaveProperty(['properties', 'id', 'type'], 'number');
  });

  it('getSchema with string field parameters#1', () => {
    const user_schema_id = getSchema(doc, 'User', 'id');
    expect(user_schema_id).toHaveProperty('type', 'number');
  });

  it('getSchema with string field parameters#2', () => {
    const user_schema_timelineBackground = getSchema(doc, 'User', 'timelineBackground');
    expect(user_schema_timelineBackground).toHaveProperty(['properties', 'id', 'type'], 'number');
  });

  it('getSchema with array field parameters#1', () => {
    const user_schema_timelineBackground_id = getSchema(doc, 'User', ['timelineBackground', 'id']);
    expect(user_schema_timelineBackground_id).toHaveProperty('type', 'number');
  });

  it('getSchema with array field parameters#2', () => {
    const user_schema_timelineBackground_bucket_id = getSchema(doc, 'User', [
      'timelineBackground',
      'bucket',
      'id',
    ]);
    expect(user_schema_timelineBackground_bucket_id).toHaveProperty('type', 'number');
  });

  it('getSchema with array field parameters#3', () => {
    const user_schema_timelineBackground_objectUrl_webp = getSchema(doc, 'User', [
      'timelineBackground',
      'objectUrl',
      'webp',
    ]);
    expect(user_schema_timelineBackground_objectUrl_webp).toHaveProperty('type', 'string');
  });

  it('convert', () => {
    const res = convertV3SchemaToCode(doc, 'User');
    expect(res).toContainEqual({
      dataIndex: 'id',
      title: 'User id',
    });
  });

  it('generateTableCode with string field parameters', () => {
    const res = generateTableCode(doc, {
      url: '/api/user/current',
      method: 'get',
      fieldPath: 'timelineBackground',
    });
    const $ref = Reflect.getMetadata('$ref', res);
    expect($ref).toBe('Asset');
    expect(res).toContainEqual({
      dataIndex: 'id',
    });
  });
});
