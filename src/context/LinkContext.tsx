import type { Context, Dispatch } from 'react';
import { createContext } from 'react';
import type { LinkContextState } from '@/type/GlobalContext';
import type { GlobalContextAction } from '@/context/GlobalContextProvider';

export const LinkContext = createContext(null) as unknown as Context<{
  state: LinkContextState;
  dispatch: Dispatch<GlobalContextAction>;
}>;
