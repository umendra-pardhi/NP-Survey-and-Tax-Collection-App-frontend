import React, { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { Button, Input, Label, Screen, Section, Title } from '@/components/UI';
import { apiService } from '@/services/apiService';

const ROLE_OPTIONS = ['admin', 'numbering', 'surveyor', 'tax_collector', 'user'] as const;

export const UserCreationScreen = () => {
  const { config } = useAuth();
  const [role, setRole] = useState<(typeof ROLE_OPTIONS)[number]>('user');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');

  const onCreate = async () => {
    try {
      if (!config) throw new Error('Setup not completed.');
      const result = await apiService.register({
        server: config.serverUrl,
        database: config.dbName,
        db_username: config.loginId,
        db_password: config.password,
        UserName: name,
        Mobile: mobile,
        EMail: email,
        LoginID: loginId,
        Password: password,
        UserRole: role,
        UserLocation: false,
        ClientID: 0,
      });
      if (!result.success) {
        throw new Error(result.message || 'Unable to create user');
      }
      Alert.alert('Success', 'User created.');
      setName('');
      setMobile('');
      setEmail('');
      setLoginId('');
      setPassword('');
    } catch (error) {
      Alert.alert('Failed', error instanceof Error ? error.message : 'Unable to create user');
    }
  };

  return (
    <Screen>
      <Title>Create User</Title>
      <Section>
        <Label>Role</Label>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {ROLE_OPTIONS.map((item) => (
            <Pressable
              key={item}
              onPress={() => setRole(item)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: role === item ? '#145DA0' : '#D8DCE8',
                backgroundColor: role === item ? '#E4EEF7' : '#FFFFFF',
              }}
            >
              <Text style={{ color: role === item ? '#145DA0' : '#2B2D3A', fontWeight: '600' }}>{item}</Text>
            </Pressable>
          ))}
        </View>
        <Label>Name</Label>
        <Input value={name} onChangeText={setName} />
        <Label>Mobile</Label>
        <Input value={mobile} onChangeText={setMobile} keyboardType="numeric" />
        <Label>Email</Label>
        <Input value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Label>Login ID</Label>
        <Input value={loginId} onChangeText={setLoginId} />
        <Label>Password</Label>
        <Input value={password} onChangeText={setPassword} secureTextEntry />
        <Button text="Create User" onPress={onCreate} />
      </Section>
    </Screen>
  );
};
