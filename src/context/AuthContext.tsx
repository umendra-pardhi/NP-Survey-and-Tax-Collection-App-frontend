import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { initializeDatabase } from '@/db/database';
import { apiService } from '@/services/apiService';
import { ServerConfig, User } from '@/types';

const CONFIG_KEY = 'NPA_SERVER_CONFIG';
const USER_KEY = 'NPA_CURRENT_USER';
const TOKEN_KEY = 'NPA_ACCESS_TOKEN';

export interface DatabaseCredentials {
  server: string;
  database: string;
  db_username: string;
  db_password: string;
}

interface AuthContextValue {
  loading: boolean;
  isSetupDone: boolean;
  user: User | null;
  config: ServerConfig | null;
  dbCredentials: DatabaseCredentials | null;
  saveSetup: (value: ServerConfig) => Promise<void>;
  login: (loginId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const toDbCredentials = (value: ServerConfig): DatabaseCredentials => ({
  server: value.serverUrl,
  database: value.dbName,
  db_username: value.loginId,
  db_password: value.password,
});

export const getSavedDbCredentials = async () => {
  const savedConfig = await AsyncStorage.getItem(CONFIG_KEY);
  if (!savedConfig) return null;
  return toDbCredentials(JSON.parse(savedConfig) as ServerConfig);
};

const mapApiRoleToAppRole = (apiRole: string): User['role'] => {
  const value = apiRole.trim().toUpperCase();
  if (value === 'ADMIN' || value === 'ADMINISTRATOR') return 'ADMIN';
  if (value === 'NUMBERING' || value === 'NUMBERING_STAFF' || value === 'NUMBERING STAFF') return 'NUMBERING';
  if (value === 'SURVEY' || value === 'SURVEYOR') return 'SURVEY';
  if (value === 'TAX' || value === 'TAX_COLLECTOR' || value === 'TAX COLLECTOR') return 'TAX';
  return 'SURVEY';
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [isSetupDone, setIsSetupDone] = useState(false);
  const [config, setConfig] = useState<ServerConfig | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const dbCredentials = useMemo(() => (config ? toDbCredentials(config) : null), [config]);

  useEffect(() => {
    const bootstrap = async () => {
      await initializeDatabase();
      const savedConfig = await AsyncStorage.getItem(CONFIG_KEY);
      const savedUser = await AsyncStorage.getItem(USER_KEY);
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
        setIsSetupDone(true);
      }
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };
    bootstrap();
  }, []);

  const saveSetup = async (value: ServerConfig) => {
    await AsyncStorage.setItem(CONFIG_KEY, JSON.stringify(value));
    setConfig(value);
    setIsSetupDone(true);
  };

  const login = async (loginId: string, password: string) => {
    if (!config) throw new Error('Setup not completed.');

    const result = await apiService.login({
      ...toDbCredentials(config),
      LoginID: loginId,
      Password: password,
    });

    if (!result.success || !result.user) {
      throw new Error(result.message || 'Invalid credentials.');
    }

    const mappedUser: User = {
      id: result.user.UserID,
      role: mapApiRoleToAppRole(result.user.UserRole),
      name: result.user.UserName,
      mobile: result.user.Mobile,
      email: result.user.EMail,
      login_id: result.user.LoginID,
    };

    setUser(mappedUser);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(mappedUser));
    await AsyncStorage.setItem(TOKEN_KEY, result.access_token);
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem(USER_KEY);
    await AsyncStorage.removeItem(TOKEN_KEY);
  };

  const value = useMemo(
    () => ({ loading, isSetupDone, user, config, dbCredentials, saveSetup, login, logout }),
    [loading, isSetupDone, user, config, dbCredentials],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
