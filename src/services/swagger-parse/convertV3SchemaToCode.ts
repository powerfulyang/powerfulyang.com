import type { OpenAPIV3 } from 'openapi-types';
import { convertObjectToCode } from '@/services/swagger-parse/convertObjectToCode';
import { getSchema } from '@/services/swagger-parse/getSchema';
import { getSchemaName } from '@/services/swagger-parse/getSchemaName';

export const convertV3SchemaToCode = (
  doc: OpenAPIV3.Document,
  schema: string,
  fieldPath?: string | string[],
  paths: string[] = [],
  data: Record<string, any>[] = [],
  entity = getSchema(doc, schema, fieldPath),
) => {
  // SchemaObject
  if ('type' in entity && entity.type && entity.type !== 'object') {
    if (entity.type === 'array') {
      if (paths.length !== 0) {
        data.push({
          dataIndex: paths,
          title: entity.description,
        });
      }
      // paths.length === 0
      if ('$ref' in entity.items) {
        convertObjectToCode(doc, entity.items.$ref, paths, data);
        Reflect.defineMetadata('$ref', getSchemaName(entity.items.$ref), entity);
      }
    } else {
      // 不支持其他类型
      throw new Error(`${entity.type} is not support`);
    }
  } else if ('type' in entity && entity.type === 'object') {
    convertObjectToCode(doc, schema, paths, data, entity);
  }
  const $ref = Reflect.getMetadata('$ref', entity);
  Reflect.defineMetadata('$ref', $ref, data);
  return data;
};
