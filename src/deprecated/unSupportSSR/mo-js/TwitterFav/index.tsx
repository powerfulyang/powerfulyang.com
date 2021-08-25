import React from 'react';
import { useTwitterFavorite } from '@/deprecated/unSupportSSR/mo-js';

const TwitterFav = () => {
  useTwitterFavorite();
  return <></>;
};

export default TwitterFav;
