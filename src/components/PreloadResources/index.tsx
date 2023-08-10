'use client';

import { preload } from 'react-dom';
import { generateCdnStaticUrl } from '@/constant/Constant';

export const PreloadResources = () => {
  preload(generateCdnStaticUrl('/fonts/zpix.woff'), {
    as: 'font',
    crossOrigin: 'anonymous',
  });
  preload('/fonts/uU9eCBsR6Z2vfE9aq3bL0fxyUs4tcw4W_D1sJVD7Ng.woff2', {
    as: 'font',
    crossOrigin: 'anonymous',
  });

  return null;
};
