'use client';

import { fetchAuthUserDetails } from '@/services/users.service';
import { User } from '@repo/api-lib/api';
import { useQuery } from '@tanstack/react-query';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

type AuthUserContextType = {
  authUser: User | undefined;
};

const AuthUserContext = createContext<AuthUserContextType | undefined>(
  undefined,
);

export default function AuthUserProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [authUser, setAuthUser] = useState<User | undefined>(undefined);

  const { data, isError } = useQuery({
    queryKey: ['auth-user'],
    queryFn: fetchAuthUserDetails,
  });

  useEffect(() => {
    if (isError) return;

    setAuthUser(data);
  }, [data]);

  return (
    <AuthUserContext.Provider value={{ authUser }}>
      {children}
    </AuthUserContext.Provider>
  );
}

export const useAuthUser = () => {
  const context = useContext(AuthUserContext);
  if (!context) {
    throw new Error('useAuthUser must be used within a AuthUserProvider');
  }
  return context;
};
