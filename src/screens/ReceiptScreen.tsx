import React from 'react';
import { Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Screen, Section, Title } from '@/components/UI';
import { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Receipt'>;

export const ReceiptScreen = ({ route, navigation }: Props) => (
  <Screen>
    <Title>Receipt</Title>
    <Section>
      <Text>Payment Saved Successfully</Text>
      <Text>Receipt No: {route.params.receiptNo}</Text>
    </Section>
    <Button text="Back to Tax Dashboard" onPress={() => navigation.navigate('TaxDashboard')} />
  </Screen>
);
