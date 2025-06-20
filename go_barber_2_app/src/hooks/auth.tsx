import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '../services/api';
import { TOKEN_KEY, USER_KEY } from '../constants/auth';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  created_at: string;
  updated_at: string;
  avatar_url: string | null;
}

interface AuthContextData {
  user: User;
  signIn(credentials: { email: string; password: string }): Promise<void>;
  signUp(credentials: {
    name: string;
    email: string;
    password: string;
  }): Promise<void>;
  signOut(): void;
  loading: boolean;
  updateUser(user: User): void;
}

type SignInParams = {
  email: string;
  password: string;
};

type SignUpParams = {
  name: string;
  email: string;
  password: string;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthState {
  token: string;
  user: User;
}

function AuthProvider({ children }: React.PropsWithChildren) {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getInitialState(): Promise<void> {
      const [tokenStorage, userStorage] = await AsyncStorage.multiGet([
        TOKEN_KEY,
        USER_KEY,
      ]);

      if (tokenStorage[1] && userStorage[1]) {
        api.setToken(tokenStorage[1]);
        setData({ token: tokenStorage[1], user: JSON.parse(userStorage[1]) });
      }

      setLoading(false);
    }
    getInitialState();
  }, []);

  const signIn = useCallback(async ({ email, password }: SignInParams) => {
    const response = await api.login({
      email,
      password,
    });

    const { token, user } = response.data;

    await AsyncStorage.multiSet([
      [TOKEN_KEY, token],
      [USER_KEY, JSON.stringify(user)],
    ]);

    setData({ token, user });
  }, []);

  const signUp = useCallback(
    async ({ name, email, password }: SignUpParams) => {
      await api.signup({ name, email, password });
    },
    [],
  );

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);

    api.removeToken();

    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(async (user: AuthState['user']) => {
    setData(oldData => ({ token: oldData.token, user }));

    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signUp, signOut, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = (): AuthContextData => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return authContext;
};

export { AuthProvider, useAuth };
