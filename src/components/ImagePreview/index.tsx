import type { FC, PropsWithChildren, ReactElement } from 'react';
import React, { Children, cloneElement, useEffect, useMemo } from 'react';
import { useImmerReducer } from '@powerfulyang/hooks';
import type {
  ImageModalContextAction,
  ImagePreviewContextState,
} from '@/context/ImagePreviewContext';
import { ImagePreviewContext, ImagePreviewContextActionType } from '@/context/ImagePreviewContext';
import type { Asset } from '@/type/Asset';
import ImagePreviewModal from '@/components/ImagePreview/ImagePreviewModal';

const reducer = (draft: ImagePreviewContextState, action: ImageModalContextAction) => {
  switch (action.type) {
    case ImagePreviewContextActionType.close:
      draft.selectIndex = undefined;
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

type SelfControlProps = PropsWithChildren<unknown>;

type Props = {
  images: Asset[];
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
            onClick() {
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
