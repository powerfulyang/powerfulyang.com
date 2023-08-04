import type { ProColumns } from '@ant-design/pro-components';
import type { OpenAPIV2 } from 'openapi-types';
import { convertObjectToCode } from '@/services/swagger-parse/convertObjectToCode';
import { getSchema } from '@/services/swagger-parse/getSchema';

export const convertV2SchemaToCode = (
  doc: OpenAPIV2.Document,
  schema: string,
  fieldPath?: string | string[],
  paths: string[] = [],
  data: ProColumns[] = [],
  entity = getSchema(doc, schema, fieldPath),
) => {
  // SchemaObject
  if (entity.type === 'object') {
    convertObjectToCode(doc, schema, paths, data, entity);
  }
  const $ref = Reflect.getMetadata('$ref', entity);
  console.log($ref);
  Reflect.defineMetadata('$ref', $ref, data);
  return data;
};
