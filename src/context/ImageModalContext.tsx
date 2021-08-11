import { Context, createContext, Dispatch } from 'react';

export type ImageModalContextState = {
  visible?: boolean;
  selectImage?: string;
};

export enum ImageModalContextActionType {
  close,
  open,
}

export type ImageModalContextAction = {
  type: ImageModalContextActionType;
  payload?: Partial<ImageModalContextState>;
};

export const ImageModalContext = createContext(null) as unknown as Context<{
  state: ImageModalContextState;
  dispatch: Dispatch<ImageModalContextAction>;
}>;
