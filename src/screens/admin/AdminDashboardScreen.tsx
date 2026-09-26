import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Screen, Title } from '@/components/UI';
import { RootStackParamList } from '@/navigation/types';

export const AdminDashboardScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <Screen>
      <Title>Admin Dashboard</Title>
      <Button text="User Management" onPress={() => navigation.navigate('UserCreation')} /> 
        <Button text="Sync Data" onPress={() => navigation.navigate('Sync')} />
      <Button text="Numbering" variant="secondary" onPress={() => navigation.navigate('Reports')} />
        <Button text="Survey" variant="secondary" onPress={() => navigation.navigate('Reports')} />
          <Button text="Tax Collection" variant="secondary" onPress={() => navigation.navigate('Reports')} />
            {/* <Button text="Reports" variant="secondary" onPress={() => navigation.navigate('Reports')} /> */}
     
    </Screen>
  );
};
