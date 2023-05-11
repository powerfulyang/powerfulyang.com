import type { ProColumns } from '@ant-design/pro-components';
import type { OpenAPIV2, OpenAPIV3 } from 'openapi-types';
import { getSchema } from '@/services/swagger-parse/getSchema';

export function convertObjectToCode(
  doc: OpenAPIV3.Document | OpenAPIV2.Document,
  _schema: string,
  paths: string[],
  data: ProColumns[] = [],
  entity: OpenAPIV3.SchemaObject | OpenAPIV2.SchemaObject = getSchema(doc, _schema),
) {
  for (const [key, value] of Object.entries(entity.properties || {})) {
    // circular reference
    if (paths.includes(key)) {
      // eslint-disable-next-line no-console
      console.warn(`schema ${_schema} is circular reference, ignore`);
    } else if ('type' in value && value.type) {
      let dataIndex: string | string[] = key;
      if (paths.length) {
        dataIndex = paths.concat(key);
      }
      const { type, description, format } = value;
      let valueType: ProColumns['valueType'];
      if (type === 'string' && format === 'date-time') {
        valueType = 'dateTime';
      }
      data.push({
        dataIndex,
        title: description,
        valueType,
      });
    } else if ('$ref' in value) {
      // recursive
      const v = convertObjectToCode(doc, value.$ref, paths.concat(key));
      data.push(...v);
    }
  }
  return data;
}
