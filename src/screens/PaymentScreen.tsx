import React, { useState } from 'react';
import { Alert, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '@/context/AuthContext';
import { Button, Input, Label, Screen, Section, Title } from '@/components/UI';
import { RootStackParamList } from '@/navigation/types';
import { calcTotalTax } from '@/services/taxService';
import { saveTaxRecord } from '@/services/taxService';

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

export const PaymentScreen = ({ route, navigation }: Props) => {
  const { user } = useAuth();
  const totalTax = calcTotalTax(route.params.taxes);
  const [paidAmount, setPaidAmount] = useState(String(totalTax));
  const [paymentMode, setPaymentMode] = useState('QR');

  const onConfirm = async () => {
    try {
      if (!user) return;
      const receiptNo = await saveTaxRecord({
        propertyId: route.params.propertyId,
        collectorId: user.id,
        previousTax: route.params.previousTax,
        taxes: route.params.taxes,
        paidAmount: Number(paidAmount || 0),
        paymentMode,
      });
      navigation.replace('Receipt', { receiptNo });
    } catch (error) {
      Alert.alert('Payment Error', error instanceof Error ? error.message : 'Failed');
    }
  };

  return (
    <Screen>
      <Title>Payment</Title>
      <Section>
        <Text>Total Payable: ₹{totalTax}</Text>
        <Text>QR Code support: enabled (server-integrated QR can be added in API phase)</Text>
        <Label>Amount Paying</Label>
        <Input value={paidAmount} onChangeText={setPaidAmount} keyboardType="numeric" />
        <Label>Payment Mode</Label>
        <Input value={paymentMode} onChangeText={setPaymentMode} />
        <Button text="Confirm Payment" onPress={onConfirm} />
      </Section>
    </Screen>
  );
};
