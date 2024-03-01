import type { Asset } from '@/__generated__/api';
import ImagePreviewModal from '@/components/ImagePreview/ImagePreviewModal';
import type {
  ImageModalContextAction,
  ImagePreviewContextState,
} from '@/context/ImagePreviewContext';
import { ImagePreviewContext, ImagePreviewContextActionType } from '@/context/ImagePreviewContext';
import { useImmerReducer } from '@powerfulyang/hooks';
import type { FC, PropsWithChildren } from 'react';
import { useContext, useMemo } from 'react';

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
    default:
  }
};

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
      original: objectUrl.webp,
      thumbnail: objectUrl.thumbnail_300_,
      size: { width, height },
    };
  });
};

type Props = {
  images: ImagePreviewItem[];
};

export const ImagePreview: FC<PropsWithChildren<Props>> = ({ images, children }) => {
  const [state, dispatch] = useImmerReducer<ImagePreviewContextState, ImageModalContextAction>(
    reducer,
    {},
  );

  const memo = useMemo(() => {
    return { state, dispatch, images };
  }, [state, dispatch, images]);

  return (
    <ImagePreviewContext.Provider value={memo}>
      <ImagePreviewModal />
      {children}
    </ImagePreviewContext.Provider>
  );
};

export const ImagePreviewAction: FC<
  PropsWithChildren<{
    previewIndex: number;
    className?: string;
  }>
> = ({ previewIndex, children, className }) => {
  const { dispatch } = useContext(ImagePreviewContext);
  const onClick = () => {
    dispatch({
      type: ImagePreviewContextActionType.open,
      payload: {
        selectIndex: previewIndex,
      },
    });
  };

  return (
    <button type="button" className={className} onClick={onClick}>
      {children}
    </button>
  );
};
