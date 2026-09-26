import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '@/context/AuthContext';
import { Button, Input, Label, Screen, Section, Title } from '@/components/UI';
import { RootStackParamList } from '@/navigation/types';



export const LoginScreen = () => {
 
  const { login } = useAuth();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = async () => {
    try {
      if (!loginId || !password) throw new Error('Login ID and Password are required.');
      await login(loginId, password);
    } catch (error) {
      Alert.alert('Login Failed', error instanceof Error ? error.message : 'Invalid user');
    }
  };

  return (
    <Screen>
      <Title>Login / लॉगिन</Title>
       <Section>
    
        <Label>Login ID</Label>
        <Input value={loginId} onChangeText={setLoginId} />
        <Label>Password</Label>
        <Input value={password} onChangeText={setPassword} secureTextEntry />
        <Button text="Login" onPress={onLogin} />
        {/* <Button text="Register New User" variant="secondary" onPress={() => navigation.navigate('UserCreation')} /> */}
      </Section>
    </Screen>
  );
};
