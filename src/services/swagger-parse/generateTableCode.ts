import type { OpenAPIV2, OpenAPIV3 } from 'openapi-types';
import { get } from 'lodash-es';
import { isOpenAPIV3 } from '@/services/swagger-parse/isOpenAPIV3';
import { convertV3SchemaToCode } from '@/services/swagger-parse/convertV3SchemaToCode';
import { convertV2SchemaToCode } from '@/services/swagger-parse/convertV2SchemaToCode';

export const generateTableCode = (
  doc: OpenAPIV3.Document | OpenAPIV2.Document,
  options: {
    url: string;
    method?: string;
    fieldPath?: string | string[];
  },
) => {
  const { url, method = 'post', fieldPath } = options;
  const operation: OpenAPIV3.OperationObject | OpenAPIV2.OperationObject = get(doc.paths, [
    url,
    method,
  ]);
  const { operationId } = operation;
  if (!operation) throw new Error(`path ${url} not found`);
  const { responses } = operation;
  if (!responses) throw new Error(`path ${url} responses not found`);
  const { '200': response } = responses;
  if (!response) throw new Error(`path ${url} response 200 not found`);

  if (isOpenAPIV3(doc)) {
    const v3Response = response as OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject;
    // v3 ReferenceObject
    if ('$ref' in v3Response) {
      const res = convertV3SchemaToCode(doc, v3Response.$ref, fieldPath);
      Reflect.defineMetadata('operationId', operationId, res);
      return res;
    }
    // v3 ResponseObject
    const { content } = v3Response;
    if (!content) throw new Error(`path ${url} response 200 content not found`);
    const { 'application/json': json } = content;
    if (!json) throw new Error(`path ${url} response 200 content application/json not found`);
    if (!json.schema) {
      throw new Error(`path ${url} response 200 content application/json schema not found`);
    }

    const { schema } = json;
    // only support ReferenceObject
    if ('$ref' in schema) {
      const res = convertV3SchemaToCode(doc, schema.$ref, fieldPath);
      Reflect.defineMetadata('operationId', operationId, res);
      return res;
    }
    throw new Error(`path ${url} response 200 content application/json schema not support`);
  }
  const v2Response = response as OpenAPIV2.Response;
  // v2 ReferenceObject
  if ('$ref' in v2Response) {
    return convertV2SchemaToCode(doc, v2Response.$ref, fieldPath);
  }
  if (!v2Response.schema) throw new Error(`path ${url} response 200 schema not found`);
  // v2 ResponseObject
  const { schema } = v2Response;
  if ('$ref' in schema && schema.$ref) {
    return convertV2SchemaToCode(doc, schema.$ref, fieldPath);
  }
  throw new Error(`path ${url} response 200 schema not support`);
};
