import React, { FC } from 'react';
import { useImmerReducer } from '@powerfulyang/hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { LinkContext } from '@/context/LinkContext';
import { GlobalContextState } from '@/type/GlobalContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

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
    <QueryClientProvider client={queryClient}>
      <LinkContext.Provider
        value={{
          state,
          dispatch,
        }}
      >
        {children}
      </LinkContext.Provider>
    </QueryClientProvider>
  );
};
