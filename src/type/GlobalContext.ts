import type { FC } from 'react';

type LayoutProps = {
  props: {
    layout: {
      pathViewCount?: string;
    };
  };
} & string;

export type LayoutFC<T = any> = {
  getLayout: (page: LayoutProps) => any;
} & FC<T>;
