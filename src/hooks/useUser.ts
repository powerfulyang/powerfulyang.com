import type { User } from '@/type/User';
import { atom, useAtom } from 'jotai';
import type { Nullable } from '@powerfulyang/utils';

export const UserAtom = atom<Nullable<User>>(null);

export const useUser = () => {
  const [user] = useAtom(UserAtom);
  return user;
};
