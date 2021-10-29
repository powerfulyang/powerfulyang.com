import type { FC } from 'react';

export type LinkContextState = {
  isRedirecting: boolean;
};

export type GlobalContextState = LinkContextState;

export type LayoutFC<T = any> = {
  getLayout: (page: any) => any;
} & FC<T>;
