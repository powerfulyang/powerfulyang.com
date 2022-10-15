import type { FC, PropsWithChildren, ReactElement } from 'react';
import React, { Children, cloneElement, useEffect, useMemo } from 'react';
import { useImmerReducer } from '@powerfulyang/hooks';
import type {
  ImageModalContextAction,
  ImagePreviewContextState,
} from '@/context/ImagePreviewContext';
import { ImagePreviewContext, ImagePreviewContextActionType } from '@/context/ImagePreviewContext';
import ImagePreviewModal from '@/components/ImagePreview/ImagePreviewModal';
import type { Asset } from '@/type/Asset';
import { CosUtils } from '@/utils/lib';
import type { VoidFunction } from '@powerfulyang/utils';

const reducer = (draft: ImagePreviewContextState, action: ImageModalContextAction) => {
  switch (action.type) {
    case ImagePreviewContextActionType.close:
      if (draft.selectIndex === action.payload?.selectIndex) {
        draft.selectIndex = undefined;
      }
      break;
    case ImagePreviewContextActionType.open:
      draft.selectIndex = action.payload?.selectIndex;
      break;
    case ImagePreviewContextActionType.updateImages:
      draft.images = action.payload?.images;
      break;
    default:
  }
};

type ParentControlProps = {
  parentControl: unknown;
  children: ReactElement<{ onClick: VoidFunction }>[];
};

type SelfControlProps = PropsWithChildren;

export type ImagePreviewItem = {
  thumbnail: string;
  original: string;
  size?: {
    width: number;
    height: number;
  };
  id?: string;
};

export const castAssetsToImagePreviewItem = (assets: Asset[]): ImagePreviewItem[] => {
  return assets.map((asset) => {
    const {
      id,
      objectUrl,
      size: { width, height },
    } = asset;
    return {
      id: String(id),
      original: CosUtils.getCosObjectUrl(objectUrl),
      thumbnail: CosUtils.getCosObjectThumbnailUrl(objectUrl),
      size: { width, height },
    };
  });
};

type Props = {
  images: ImagePreviewItem[];
} & (ParentControlProps | SelfControlProps);

export const ImagePreview: FC<Props> = ({ images, ...props }) => {
  const [state, dispatch] = useImmerReducer<ImagePreviewContextState, ImageModalContextAction>(
    reducer,
    {},
  );
  useEffect(() => {
    dispatch({
      type: ImagePreviewContextActionType.updateImages,
      payload: {
        images,
      },
    });
  }, [dispatch, images]);
  const memo = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  const childRender = useMemo(() => {
    return (
      ('parentControl' in props &&
        Children.map(props.children, (child, index) =>
          cloneElement(child, {
            onClick(e: MouseEvent) {
              child.props.onClick?.(e);
              dispatch({
                type: ImagePreviewContextActionType.open,
                payload: {
                  selectIndex: index,
                },
              });
            },
          }),
        )) ||
      props.children
    );
  }, [dispatch, props]);

  return (
    <ImagePreviewContext.Provider value={memo}>
      <ImagePreviewModal />
      {childRender}
    </ImagePreviewContext.Provider>
  );
};
