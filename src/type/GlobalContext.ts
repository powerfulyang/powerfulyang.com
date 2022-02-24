import type { FC } from 'react';

export type LayoutFC<T = any> = {
  getLayout: (page: any) => any;
} & FC<T>;
