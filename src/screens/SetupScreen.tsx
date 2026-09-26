import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { Button, Input, Label, Screen, Section, Title } from '@/components/UI';
import { apiService } from '@/services/apiService';

export const SetupScreen = () => {
  const { saveSetup } = useAuth();
  const [serverUrl, setServerUrl] = useState('');
  const [dbName, setDbName] = useState('');
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onConnect = async () => {
    try {
      if (!serverUrl || !dbName || !loginId || !password) {
        throw new Error('All DB credentials are required.');
      }

      setLoading(true);
      const result = await apiService.initialConnect({
        server: serverUrl,
        database: dbName,
        db_username: loginId,
        db_password: password,
      });

      if (!result.success) {
        throw new Error(`[${result.error_code}] ${result.message}` || 'Database validation failed.');
      }

      await saveSetup({ serverUrl, dbName, loginId, password });
      Alert.alert(
        'Setup Complete',
        `${result.message || 'Database connected successfully'} (Users: ${result.client_count ?? 0})`,
      );
    } catch (error) {
      Alert.alert('Connection Failed', error instanceof Error ? error.message : 'Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Title>DB Configuration</Title>
      <Section>
        <Label>SQL Server Address/Hostname</Label>
        <Input value={serverUrl} onChangeText={setServerUrl} placeholder="localhost" />
        <Label>Database Name</Label>
        <Input value={dbName} onChangeText={setDbName} placeholder="dbname" />
        <Label>Username</Label>
        <Input value={loginId} onChangeText={setLoginId} placeholder="username" />
        <Label>Password</Label>
        <Input value={password} onChangeText={setPassword} placeholder="password" secureTextEntry />
        <Button text={loading ? 'Validating...' : 'Connect & Save'} onPress={onConnect} />
      </Section>
    </Screen>
  );
};
