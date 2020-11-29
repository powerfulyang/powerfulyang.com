import React, { FC } from 'react';
import { LinkContext } from '@/context/LinkContext';
import { useImmerReducer } from '@powerfulyang/hooks';
import { GlobalContextState } from '@/types/GlobalContext';

export enum GlobalContextActionType {
  LinkRedirectStart,
  LinkRedirectEnd,
}

export type GlobalContextAction = {
  type: GlobalContextActionType;
  payload?: Partial<GlobalContextState>;
};

const reducer = (draft: GlobalContextState, action: GlobalContextAction) => {
  switch (action.type) {
    case GlobalContextActionType.LinkRedirectStart:
      draft.isRedirecting = true;
      break;
    case GlobalContextActionType.LinkRedirectEnd:
      draft.isRedirecting = false;
      break;
    default:
      break;
  }
};

export const GlobalContextProvider: FC = ({ children }) => {
  const [state, dispatch] = useImmerReducer(reducer, {
    isRedirecting: false,
  });
  return (
    <LinkContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </LinkContext.Provider>
  );
};
