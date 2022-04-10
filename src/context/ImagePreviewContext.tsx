import type { Context, Dispatch } from 'react';
import { createContext } from 'react';
import type { Asset } from '@/type/Asset';

export type ImagePreviewContextState = {
  selectIndex?: number;
  images?: Asset[];
};

export enum ImagePreviewContextActionType {
  close,
  open,
  updateImages,
}

export type ImageModalContextAction = {
  type: ImagePreviewContextActionType;
  payload?: Partial<ImagePreviewContextState>;
};

export const ImagePreviewContext = createContext(null) as unknown as Context<{
  state: ImagePreviewContextState;
  dispatch: Dispatch<ImageModalContextAction>;
}>;
