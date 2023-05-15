import { convertObjectToCode } from '@/services/swagger-parse/convertObjectToCode';
import { getSchema } from '@/services/swagger-parse/getSchema';
import type { ProColumns } from '@ant-design/pro-components';
import type { OpenAPIV3 } from 'openapi-types';

export const convertV3SchemaToCode = (
  doc: OpenAPIV3.Document,
  schema: string,
  fieldPath?: string | string[],
  paths: string[] = [],
  data: ProColumns[] = [],
  entity = getSchema(doc, schema, fieldPath),
) => {
  // SchemaObject
  if ('type' in entity && entity.type && entity.type !== 'object') {
    if (entity.type === 'array') {
      data.push({
        dataIndex: paths,
        title: entity.description,
      });
    }
    // 不支持其他类型
    throw new Error(`${entity.type} is not support`);
  } else if ('type' in entity && entity.type === 'object') {
    convertObjectToCode(doc, schema, paths, data, entity);
  }
  const $ref = Reflect.getMetadata('$ref', entity);
  Reflect.defineMetadata('$ref', $ref, data);
  return data;
};
