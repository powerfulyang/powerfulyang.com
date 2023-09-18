import type { Context, Dispatch } from 'react';
import { createContext } from 'react';
import type { ImagePreviewItem } from '@/components/ImagePreview';

export type ImagePreviewContextState = {
  selectIndex?: number;
};

export enum ImagePreviewContextActionType {
  close,
  open,
}

export type ImageModalContextAction = {
  type: ImagePreviewContextActionType;
  payload?: Partial<ImagePreviewContextState>;
};

export const ImagePreviewContext = createContext({
  dispatch: () => {},
}) as unknown as Context<{
  state: ImagePreviewContextState;
  dispatch: Dispatch<ImageModalContextAction>;
  images?: ImagePreviewItem[];
}>;
