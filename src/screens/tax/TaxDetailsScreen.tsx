import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Screen, Section, Title } from '@/components/UI';
import { RootStackParamList } from '@/navigation/types';
import { getPropertyById } from '@/services/propertyService';
import { getLatestTaxByProperty } from '@/services/taxService';
import { PropertyRow } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'TaxDetails'>;

export const TaxDetailsScreen = ({ route, navigation }: Props) => {
  const [property, setProperty] = useState<PropertyRow | null>(null);
  const [previousTax, setPreviousTax] = useState(0);

  useEffect(() => {
    getPropertyById(route.params.propertyId).then((p) => setProperty(p ?? null));
    getLatestTaxByProperty(route.params.propertyId).then((row) => setPreviousTax(row?.total_tax ?? 0));
  }, [route.params.propertyId]);

  return (
    <Screen>
      <Title>Tax Details</Title>
      <Section>
        <Text>Owner: {property?.owner_name}</Text>
        <Text>Property No: {property?.property_no}</Text>
        <Text>Previous Tax: ₹{previousTax}</Text>
      </Section>
      <Button text="Enter Tax" onPress={() => navigation.navigate('TaxEntry', { propertyId: route.params.propertyId })} />
    </Screen>
  );
};
