import type { HttpClient } from '@/__generated__/api';
import { Api, ContentType } from '@/__generated__/api';
import { clientBaseHost } from '@/constant/Constant';
import { customFetch } from './customFetch';

// @ts-ignore
export class CustomApi extends Api<any> {
  protected contentFormatters: HttpClient['contentFormatters'] = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string')
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== 'string' ? JSON.stringify(input) : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        if (Array.isArray(property) && property[0] instanceof Blob) {
          property.forEach((item: Blob) => formData.append(key, item));
          return formData;
        }
        if (property instanceof Blob) {
          formData.append(key, property);
          return formData;
        }
        if (typeof property === 'string') {
          formData.append(key, property);
          return formData;
        }
        if (typeof property === 'boolean') {
          formData.append(key, `${property ? 'true' : 'false'}`);
        }
        if (typeof property === 'number') {
          formData.append(key, `${property}`);
        }
        // ignore other types
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };
}

const { api: clientApi } = new CustomApi({
  baseUrl: `//${clientBaseHost}`,
  customFetch,
  baseApiParams: {
    credentials: 'include',
  },
});

const { api: serverApi } = new Api({
  baseUrl: process.env.SERVER_BASE_URL,
  baseApiParams: {
    // edge case: server-side fetch doesn't support credentials
    credentials: undefined,
  },
});

// isServer ? serverApi : clientApi

export { clientApi, serverApi };
