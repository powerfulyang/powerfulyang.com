import { get } from 'lodash-es';
import type { OpenAPIV3 } from 'openapi-types';

export const getSchemaDefinitions = (doc: OpenAPIV3.Document, schema: string) => {
  const schemas = doc.components?.schemas;
  const entity = get(schemas, schema);
  if (!entity) throw new Error(`Entity ${schema} not found in ${doc.info.title}`);
  return entity;
};

export const convertSchemaToCode = (
  doc: OpenAPIV3.Document,
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

  const entity = getSchemaDefinitions(doc, _schema);
  const data: {
    dataIndex: string | string[];
    valueType?: string;
    title?: string;
  }[] = [];
  if ('$ref' in entity) {
    // ReferenceObject
    const v = convertSchemaToCode(doc, entity.$ref);
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
          const v = convertSchemaToCode(doc, value.$ref, paths.concat(key));
          data.push(...v);
        }
      }
    }
  }
  return data;
};

export const generateTableFromPath = (
  doc: OpenAPIV3.Document,
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
  return convertSchemaToCode(doc, schema.$ref);
};

export const swaggerPaths = (doc?: OpenAPIV3.Document) => {
  const res: string[] = [];
  Object.keys(doc?.paths || {}).forEach((path) => {
    const methods = Object.keys(doc?.paths[path] || {});
    methods.forEach((method) => {
      res.push(`${method.toUpperCase()} ${path}`);
    });
  });
  return res;
};
