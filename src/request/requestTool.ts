import { Api } from '@/__generated__/api';
import { customFetch } from './customFetch';

const { api: clientApi } = new Api({
  baseUrl: process.env.CLIENT_BASE_HOST ? `//${process.env.CLIENT_BASE_HOST}` : '',
  customFetch,
});

const { api: serverApi } = new Api({
  baseUrl: process.env.SERVER_BASE_URL,
});

// isServer ? serverApi : clientApi

export { clientApi, serverApi };
