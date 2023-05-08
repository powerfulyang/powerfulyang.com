import type { OpenAPIV2, OpenAPIV3 } from 'openapi-types';

export function isOpenAPIV3(
  doc: OpenAPIV3.Document | OpenAPIV2.Document,
): doc is OpenAPIV3.Document {
  return 'openapi' in doc;
}
