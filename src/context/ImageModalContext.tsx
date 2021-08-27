import { Context, createContext, Dispatch } from 'react';
import { Asset } from '@/types/Asset';

export type ImageModalContextState = {
  visible?: boolean;
  selectImage?: string;
  origin?: [number, number];
  images?: Asset[];
  linkImages?: [number, number];
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
