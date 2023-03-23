import { Api } from '@/__generated__/api';

const { api: clientApi } = new Api({
  baseUrl: process.env.CLIENT_BASE_HOST ? `//${process.env.CLIENT_BASE_HOST}` : '',
});

const { api: serverApi } = new Api({
  baseUrl: process.env.SERVER_BASE_URL,
});

export { clientApi, serverApi };
