import { Api } from '@/__generated__/api';
import { notification } from '@powerfulyang/components';

const { api: clientApi } = new Api({
  baseUrl: process.env.CLIENT_BASE_HOST ? `//${process.env.CLIENT_BASE_HOST}` : '',
  customFetch: async (url, options) => {
    const res = await fetch(url, options);
    if (!res.ok) {
      notification.error({
        message: 'Error',
        // @ts-ignore
        description: res.headers.get('x-error') || res.statusText,
      });
    }
    return res;
  },
});

const { api: serverApi } = new Api({
  baseUrl: process.env.SERVER_BASE_URL,
});

// isServer ? serverApi : clientApi

export { clientApi, serverApi };
