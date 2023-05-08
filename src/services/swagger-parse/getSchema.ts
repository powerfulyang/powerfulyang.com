import { getSchemaName } from '@/services/swagger-parse/getSchemaName';
import { isOpenAPIV3 } from '@/services/swagger-parse/isOpenAPIV3';
import { get } from 'lodash-es';
import type { OpenAPIV2, OpenAPIV3 } from 'openapi-types';

type _SchemaObject<T> = T extends OpenAPIV3.Document
  ? OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject
  : OpenAPIV2.SchemaObject;

export function getSchema<T extends OpenAPIV3.Document | OpenAPIV2.Document>(
  doc: T,
  schema: string,
): _SchemaObject<T>;
export function getSchema<T extends OpenAPIV3.Document | OpenAPIV2.Document>(
  doc: T,
  schema: string,
) {
  let _schema = schema;

  if (schema.startsWith('#')) {
    _schema = getSchemaName(_schema);
  }

  const isV3 = isOpenAPIV3(doc);
  if (isV3) {
    const schemas = doc.components?.schemas;
    const entity = get(schemas, _schema);
    if (!entity) throw new Error(`Entity ${_schema} not found in ${doc.info.title}`);
    return entity;
  }
  const schemas = doc.definitions;
  const entity = get(schemas, _schema);
  if (!entity) throw new Error(`Entity ${_schema} not found in ${doc.info.title}`);
  return entity;
}
