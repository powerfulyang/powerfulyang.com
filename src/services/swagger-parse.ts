import SwaggerParse from '@apidevtools/swagger-parser';

export const swaggerParse = async (url: string) => {
  return SwaggerParse.parse(url);
};
