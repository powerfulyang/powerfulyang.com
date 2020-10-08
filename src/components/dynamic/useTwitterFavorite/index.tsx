import React from 'react';
import { useDefaultCur, useTwitterFavorite } from '@powerfulyang/components';

const TwitterFavorite = () => {
  useTwitterFavorite();
  useDefaultCur();
  return <></>;
};

export default TwitterFavorite;
