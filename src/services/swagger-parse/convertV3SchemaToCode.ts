import { convertObjectToCode } from '@/services/swagger-parse/convertObjectToCode';
import { getSchema } from '@/services/swagger-parse/getSchema';
import type { ProColumns } from '@ant-design/pro-components';
import type { OpenAPIV3 } from 'openapi-types';

export const convertV3SchemaToCode = (
  doc: OpenAPIV3.Document,
  schema: string,
  paths: string[] = [],
) => {
  const entity = getSchema(doc, schema);
  const data: ProColumns[] = [];

  // ReferenceObject
  if ('$ref' in entity && entity.$ref) {
    const v = convertV3SchemaToCode(doc, entity.$ref);
    data.push(...v);
  }
  // SchemaObject
  else if ('type' in entity && entity.type && entity.type !== 'object') {
    if (entity.type === 'array') {
      data.push({
        dataIndex: paths,
        title: entity.description,
      });
    }
    // 不支持其他类型
    throw new Error(`${entity.type} is not support`);
  } else if ('type' in entity && entity.type === 'object') {
    convertObjectToCode(entity, paths, schema, data, doc, convertV3SchemaToCode);
  }
  return data;
};
