import React, { Children, cloneElement, FC, ReactElement } from 'react';
import { ImageModal } from '@/components/ImagePreview/ImageModal';
import {
  ImageModalContext,
  ImageModalContextAction,
  ImageModalContextActionType,
  ImageModalContextState,
} from '@/context/ImageModalContext';
import { useImmerReducer } from '@powerfulyang/hooks';

const reducer = (draft: ImageModalContextState, action: ImageModalContextAction) => {
  switch (action.type) {
    case ImageModalContextActionType.close:
      draft.visible = false;
      break;
    case ImageModalContextActionType.open:
      draft.visible = true;
      draft.selectImage = action.payload?.selectImage;
      break;
    default:
  }
};

export const ImagePreview: FC = ({ children }) => {
  const [state, dispatch] = useImmerReducer(reducer, {
    visible: false,
    selectImage: '',
  });
  return (
    <>
      <ImageModalContext.Provider value={{ state, dispatch }}>
        {state.visible && <ImageModal />}
      </ImageModalContext.Provider>
      {Children.map(
        children as any,
        (child: ReactElement<{ 'data-img': string; onClick: VoidFunction }>) => {
          return cloneElement(child, {
            onClick: () => {
              dispatch({
                type: ImageModalContextActionType.open,
                payload: {
                  selectImage: child?.props?.['data-img'],
                },
              });
            },
          });
        },
      )}
    </>
  );
};
