import { LayoutFC } from '@/types/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import React from 'react';

export const Gallery: LayoutFC = () => {
  return <>hello gallery!</>;
};

Gallery.getLayout = (page) => <UserLayout>{page}</UserLayout>;

export default Gallery;
