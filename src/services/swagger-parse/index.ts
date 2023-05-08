import { convertV2SchemaToCode } from '@/services/swagger-parse/convertV2SchemaToCode';
import { convertV3SchemaToCode } from '@/services/swagger-parse/convertV3SchemaToCode';
import { isOpenAPIV3 } from '@/services/swagger-parse/isOpenAPIV3';
import { get } from 'lodash-es';
import type { OpenAPIV2, OpenAPIV3 } from 'openapi-types';

export const generateTableFromPath = (
  doc: OpenAPIV3.Document | OpenAPIV2.Document,
  path: string,
  method: string = 'post',
) => {
  const operation: OpenAPIV3.OperationObject = get(doc.paths, [path, method]);
  if (!operation) throw new Error(`path ${path} not found`);
  const { responses } = operation;
  if (!responses) throw new Error(`path ${path} responses not found`);
  const { '200': response } = responses;
  if (!response) throw new Error(`path ${path} response 200 not found`);
  const { content } = response as OpenAPIV3.ResponseObject;
  if (!content) throw new Error(`path ${path} response 200 content not found`);
  const { 'application/json': json } = content;
  if (!json) throw new Error(`path ${path} response 200 content application/json not found`);
  const schema = json.schema as OpenAPIV3.ReferenceObject;
  if (!schema) {
    throw new Error(`path ${path} response 200 content application/json schema not found`);
  }
  if (isOpenAPIV3(doc)) {
    return convertV3SchemaToCode(doc, schema.$ref);
  }
  return convertV2SchemaToCode(doc, schema.$ref);
};
