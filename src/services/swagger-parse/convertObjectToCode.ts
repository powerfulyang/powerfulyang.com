import type { ProColumns } from '@ant-design/pro-components';
import type { OpenAPIV2, OpenAPIV3 } from 'openapi-types';

export function convertObjectToCode(
  entity: OpenAPIV3.NonArraySchemaObject | OpenAPIV2.SchemaObject,
  paths: string[],
  _schema: string,
  data: ProColumns[],
  doc: OpenAPIV3.Document | OpenAPIV2.Document,
  handle: Function,
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
      const v = handle(doc, value.$ref, paths.concat(key));
      data.push(...v);
    }
  }
}
