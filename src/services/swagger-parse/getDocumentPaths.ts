import type { OpenAPI } from 'openapi-types';

export type DocumentPath = {
  url: string;
  method: string;
};

export const getDocumentPaths = (doc?: OpenAPI.Document) => {
  const res: DocumentPath[] = [];
  Object.entries(doc?.paths || {}).forEach(([key, value]) => {
    const methods = Object.keys(value || {});
    methods.forEach((method) => {
      res.push({
        url: key,
        method,
      });
    });
  });
  return res;
};
