export const runtimeCaching = [
  {
    urlPattern: /\/_next\/data\/.+\/.+\.json.*$/i,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'next-data',
      expiration: {
        maxEntries: 200,
        maxAgeSeconds: 24 * 60 * 60 * 365, // 365 days
      },
    },
  },
  {
    urlPattern: ({ url }) => {
      // eslint-disable-next-line no-restricted-globals
      const isSameOrigin = self.origin === url.origin;
      const { pathname } = url;
      return isSameOrigin && pathname.startsWith('/api/');
    },
    handler: 'NetworkFirst',
    method: 'GET',
    options: {
      cacheName: 'apis',
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 24 * 60 * 60 * 365, // 365 days
      },
    },
  },
  {
    urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2)$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'static-font-assets',
      expiration: {
        maxEntries: 10,
        maxAgeSeconds: 24 * 60 * 60 * 365, // 365 days
      },
    },
  },
  {
    urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'static-image-assets',
      expiration: {
        maxEntries: 64,
        maxAgeSeconds: 24 * 60 * 60 * 30, // 30 days
      },
    },
  },
  {
    urlPattern: /\/_next\/image\?url=.+$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'next-image',
      expiration: {
        maxEntries: 64,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
    },
  },
  {
    urlPattern: /\.(?:mp3|wav|ogg)$/i,
    handler: 'CacheFirst',
    options: {
      rangeRequests: true,
      cacheName: 'static-audio-assets',
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60 * 30,
      },
    },
  },
  {
    urlPattern: /\.mp4$/i,
    handler: 'CacheFirst',
    options: {
      rangeRequests: true,
      cacheName: 'static-video-assets',
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60 * 30,
      },
    },
  },
  {
    urlPattern: /\.js$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'static-js-assets',
      expiration: {
        maxEntries: 200,
        maxAgeSeconds: 24 * 60 * 60 * 30,
      },
    },
  },
  {
    urlPattern: /\.css$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'static-style-assets',
      expiration: {
        maxEntries: 200,
        maxAgeSeconds: 24 * 60 * 60 * 30,
      },
    },
  },
  {
    urlPattern: ({ url }) => {
      const isCosAssets = url.origin.endsWith('cos.ap-shanghai.myqcloud.com');
      const isGtag = url.origin.endsWith('www.googletagmanager.com');
      const isIconfont = url.origin.endsWith('at.alicdn.com');
      return isCosAssets || isGtag || isIconfont;
    },
    // 不知道为什么 Cache Storage 非常慢
    handler: 'NetworkFirst',
    options: {
      cacheName: 'cross-origin-assets',
      expiration: {
        maxEntries: 1000,
        maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days
      },
      matchOptions: {
        ignoreVary: true,
        ignoreSearch: true,
      },
    },
  },
];
