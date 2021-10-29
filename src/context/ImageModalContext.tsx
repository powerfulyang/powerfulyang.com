import type { Context, Dispatch } from 'react';
import { createContext } from 'react';
import type { Asset } from '@/type/Asset';

export type ImageModalContextState = {
  selectIndex?: number;
  images?: Asset[];
};

export enum ImageModalContextActionType {
  close,
  open,
  updateImages,
}

export type ImageModalContextAction = {
  type: ImageModalContextActionType;
  payload?: Partial<ImageModalContextState>;
};

export const ImageModalContext = createContext(null) as unknown as Context<{
  state: ImageModalContextState;
  dispatch: Dispatch<ImageModalContextAction>;
}>;
