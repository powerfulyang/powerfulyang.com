import type { OpenAPIV3 } from 'openapi-types';

export const isSchemaObject = (entity: any): entity is OpenAPIV3.SchemaObject => {
  return 'type' in entity;
};

export const isReferenceObject = (entity: any): entity is OpenAPIV3.ReferenceObject => {
  return '$ref' in entity;
};
