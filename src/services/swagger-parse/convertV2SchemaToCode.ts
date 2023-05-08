import { convertObjectToCode } from '@/services/swagger-parse/convertObjectToCode';
import { getSchema } from '@/services/swagger-parse/getSchema';
import { getSchemaName } from '@/services/swagger-parse/getSchemaName';
import type { ProColumns } from '@ant-design/pro-components';
import type { OpenAPIV2 } from 'openapi-types';

export const convertV2SchemaToCode = (
  doc: OpenAPIV2.Document,
  schema: string,
  paths: string[] = [],
) => {
  const _schema = getSchemaName(schema);

  const entity = getSchema(doc, _schema);
  const data: ProColumns[] = [];

  // SchemaObject
  if (entity.type === 'object') {
    convertObjectToCode(entity, paths, _schema, data, doc, convertV2SchemaToCode);
  }

  return data;
};
