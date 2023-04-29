import SwaggerParser from '@apidevtools/swagger-parser';
import { get } from 'lodash-es';
import type { OpenAPIV3 } from 'openapi-types';

export const getSchemaDefinitions = async (swaggerUrl: string, schema: string) => {
  const res = (await SwaggerParser.parse(swaggerUrl)) as OpenAPIV3.Document;
  const schemas = res.components?.schemas;
  const entity = get(schemas, schema);
  if (!entity) throw new Error(`Entity ${schema} not found in ${swaggerUrl}`);
  return entity;
};

export const convertSchemaToCode = async (
  swaggerUrl: string,
  schema: string,
  paths: string[] = [],
) => {
  let _schema = schema;

  if (_schema.startsWith('#')) {
    const _ = _schema.split('/').pop();
    if (_) {
      _schema = _;
    } else {
      throw new Error('schema is not valid');
    }
  }

  const entity = await getSchemaDefinitions(swaggerUrl, _schema);
  const data: {
    dataIndex: string | string[];
    valueType?: string;
    title?: string;
  }[] = [];
  if ('$ref' in entity) {
    // ReferenceObject
    const v = await convertSchemaToCode(swaggerUrl, entity.$ref);
    data.push(...v);
  } else {
    // SchemaObject
    if (entity.type && entity.type !== 'object') {
      throw new Error(`${entity.type} is not support`);
    }
    if (entity.type === 'object' && entity.properties) {
      for (const [key, value] of Object.entries(entity.properties)) {
        if (paths.includes(key)) {
          console.warn(`schema ${_schema} is circular reference, ignore`);
        } else if ('type' in value && value.type) {
          let dataIndex: string | string[] = key;
          if (paths.length) {
            dataIndex = paths.concat(key);
          }
          const { type, description, format } = value;
          let valueType: string | undefined;
          if (type === 'string' && format === 'date-time') {
            valueType = 'dateTime';
          }
          data.push({
            dataIndex,
            title: description,
            valueType,
          });
        } else if ('$ref' in value) {
          // eslint-disable-next-line no-await-in-loop
          const v = await convertSchemaToCode(swaggerUrl, value.$ref, paths.concat(key));
          data.push(...v);
        }
      }
    }
  }
  return data;
};

export const generateTableFromPath = async (
  swaggerUrl: string,
  path: string,
  method: string = 'post',
) => {
  const res = (await SwaggerParser.parse(swaggerUrl)) as OpenAPIV3.Document;
  return get(res.paths, [path, method]);
};
