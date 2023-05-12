/* eslint @typescript-eslint/no-use-before-define: ["error", { "functions": false }] */

import { getSchemaName } from '@/services/swagger-parse/getSchemaName';
import { isOpenAPIV3 } from '@/services/swagger-parse/isOpenAPIV3';
import { get } from 'lodash-es';
import type { OpenAPIV2, OpenAPIV3 } from 'openapi-types';
import { isSchemaObject } from '@/services/swagger-parse/isSchemaObject';

type _SchemaObject<T> = T extends OpenAPIV3.Document
  ? OpenAPIV3.SchemaObject
  : OpenAPIV2.SchemaObject;

export function getSchema<T extends OpenAPIV3.Document | OpenAPIV2.Document>(
  doc: T,
  schema: string,
  fieldPath?: string | string[],
): _SchemaObject<T>;

export function getSchema<T extends OpenAPIV3.Document | OpenAPIV2.Document>(
  doc: T,
  schema: string,
  fieldPath?: string | string[],
) {
  const _fieldPath = typeof fieldPath === 'string' ? [fieldPath] : fieldPath || [];
  const fieldPathStr = _fieldPath.join('.');

  const _schema = getSchemaName(schema);

  const isV3 = isOpenAPIV3(doc);
  if (isV3) {
    const schemas = doc.components?.schemas;
    const entity = get(schemas, _schema);
    if (!entity) throw new Error(`Entity ${_schema} not found in ${doc.info.title}`);

    // SchemaObject
    // find fieldPath in properties
    if (isSchemaObject(entity)) {
      if (Array.isArray(_fieldPath) && _fieldPath.length > 0) {
        const { properties } = entity;
        if (!properties) throw new Error(`Entity ${_schema} not found in ${doc.info.title}`);
        const field = _fieldPath.shift();
        if (!field) throw new Error(`Field ${fieldPathStr} not found in ${_schema}`);
        const _entity = get(properties, field);
        if (isSchemaObject(_entity)) {
          return getV3ObjectInfo(doc, _entity, _fieldPath);
        }
        return getSchema(doc, _entity.$ref, _fieldPath);
      }
      // fieldPath is undefined
      return entity;
    }

    // ReferenceObject
    // find fieldPath in $ref
    if (_fieldPath.length) {
      const { $ref } = entity;
      if (!$ref) throw new Error(`Entity ${_schema} not found in ${doc.info.title}`);
      const ref = getSchema(doc, $ref, _fieldPath);
      if (!ref) throw new Error(`Field ${fieldPathStr} not found in ${$ref}`);
      return ref;
    }
    return getSchema(doc, entity.$ref);
  }

  // v2
  const schemas = doc.definitions;
  const entity = get(schemas, _schema);
  if (!entity) throw new Error(`Entity ${_schema} not found in ${doc.info.title}`);
  // find fieldPath in properties
  if (_fieldPath.length) {
    const { properties, items } = entity;
    if (items && items.$ref) {
      return getSchema(doc, items.$ref, _fieldPath);
    }
    if (!properties) throw new Error(`Entity ${_schema} not found in ${doc.info.title}`);
    const field = _fieldPath.shift();
    if (!field) throw new Error(`Field ${fieldPathStr} not found in ${_schema}`);
    const _entity = get(properties, field);
    return getV2ObjectInfo(doc, _entity, _fieldPath);
  }

  return getV2ObjectInfo(doc, entity);
}

function getV3ObjectInfo(
  doc: OpenAPIV3.Document,
  schema: OpenAPIV3.SchemaObject,
  fieldPath?: string | string[],
): OpenAPIV3.SchemaObject {
  const _fieldPath = typeof fieldPath === 'string' ? [fieldPath] : fieldPath || [];
  const fieldPathStr = _fieldPath.join('.');
  if (Array.isArray(_fieldPath) && _fieldPath.length > 0) {
    const field = _fieldPath.shift();
    if (!field)
      throw new Error(`Field ${fieldPathStr} not found in ${schema.title || '_NO_TITLE_'}`);
    const _schema = get(schema.properties, field);
    if (!_schema) {
      throw new Error(`Field ${fieldPathStr} not found in ${schema.title || '_NO_TITLE_'}`);
    }
    if (isSchemaObject(_schema)) {
      return getV3ObjectInfo(doc, _schema, _fieldPath);
    }
    return getSchema(doc, _schema.$ref, _fieldPath);
  }
  // no fieldPath
  return schema;
}

function getV2ObjectInfo(
  doc: OpenAPIV2.Document,
  schema: OpenAPIV2.SchemaObject,
  fieldPath?: string | string[],
): OpenAPIV2.SchemaObject {
  const _fieldPath = typeof fieldPath === 'string' ? [fieldPath] : fieldPath || [];
  const fieldPathStr = _fieldPath.join('.');
  if (Array.isArray(_fieldPath) && _fieldPath.length > 0) {
    const field = _fieldPath.shift();
    if (!field)
      throw new Error(`Field ${fieldPathStr} not found in ${schema.title || '_NO_TITLE_'}`);
    const { properties, items } = schema;
    if (items && items.$ref) {
      return getSchema(doc, items.$ref, _fieldPath);
    }
    const _schema = get(properties, field);
    if (!_schema) {
      throw new Error(`Field ${fieldPathStr} not found in ${schema.title || '_NO_TITLE_'}`);
    }
    if (isSchemaObject(_schema)) {
      return getV2ObjectInfo(doc, _schema, _fieldPath);
    }
    if (!_schema.$ref) {
      throw new Error(`Field ${fieldPathStr} not found in ${schema.title || '_NO_TITLE_'}`);
    }
    return getSchema(doc, _schema.$ref, _fieldPath);
  }
  // array 直接返回 items 的 schema
  if (schema.type === 'array' && schema.items && schema.items.$ref) {
    return getSchema(doc, schema.items.$ref);
  }
  // no fieldPath
  return schema;
}
