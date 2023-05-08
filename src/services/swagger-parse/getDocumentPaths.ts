import type { OpenAPI } from 'openapi-types';

export const getDocumentPaths = (doc?: OpenAPI.Document) => {
  const res: string[] = [];
  Object.entries(doc?.paths || {}).forEach(([key, value]) => {
    const methods = Object.keys(value || {});
    methods.forEach((method) => {
      res.push(`${method.toUpperCase()} ${key}`);
    });
  });
  return res;
};
