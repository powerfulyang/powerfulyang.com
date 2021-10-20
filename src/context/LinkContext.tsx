import { Context, createContext, Dispatch } from 'react';
import { LinkContextState } from '@/type/GlobalContext';
import { GlobalContextAction } from '@/context/GlobalContextProvider';

export const LinkContext = createContext(null) as unknown as Context<{
  state: LinkContextState;
  dispatch: Dispatch<GlobalContextAction>;
}>;
