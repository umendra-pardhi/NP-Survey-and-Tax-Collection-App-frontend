import React, { useMemo, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Input, Label, Screen, Section, Title } from '@/components/UI';
import { RootStackParamList } from '@/navigation/types';
import { calcTotalTax } from '@/services/taxService';

type Props = NativeStackScreenProps<RootStackParamList, 'TaxEntry'>;

export const TaxEntryScreen = ({ route, navigation }: Props) => {
  const [previousTax, setPreviousTax] = useState('0');
  const [propertyTax, setPropertyTax] = useState('0');
  const [sanitationTax, setSanitationTax] = useState('0');
  const [lightingTax, setLightingTax] = useState('0');
  const [healthTax, setHealthTax] = useState('0');
  const [educationTax, setEducationTax] = useState('0');

  const totalTax = useMemo(
    () =>
      calcTotalTax({
        propertyTax: Number(propertyTax || 0),
        sanitationTax: Number(sanitationTax || 0),
        lightingTax: Number(lightingTax || 0),
        healthTax: Number(healthTax || 0),
        educationTax: Number(educationTax || 0),
      }),
    [propertyTax, sanitationTax, lightingTax, healthTax, educationTax],
  );

  return (
    <Screen>
      <Title>Tax Entry</Title>
      <Section>
        <Label>मालमत्ता कर / Property Tax</Label>
        <Input value={propertyTax} onChangeText={setPropertyTax} keyboardType="numeric" />
        <Label>स्वच्छता कर / Sanitation</Label>
        <Input value={sanitationTax} onChangeText={setSanitationTax} keyboardType="numeric" />
        <Label>दिवाबत्ती कर / Lighting</Label>
        <Input value={lightingTax} onChangeText={setLightingTax} keyboardType="numeric" />
        <Label>आरोग्य कर / Health</Label>
        <Input value={healthTax} onChangeText={setHealthTax} keyboardType="numeric" />
        <Label>शिक्षण कर / Education</Label>
        <Input value={educationTax} onChangeText={setEducationTax} keyboardType="numeric" />
        <Label>Previous Tax</Label>
        <Input value={previousTax} onChangeText={setPreviousTax} keyboardType="numeric" />
        <Label>Total Tax: ₹{totalTax}</Label>
        <Button
          text="Proceed to Payment"
          onPress={() =>
            navigation.navigate('Payment', {
              propertyId: route.params.propertyId,
              previousTax: Number(previousTax || 0),
              taxes: {
                propertyTax: Number(propertyTax || 0),
                sanitationTax: Number(sanitationTax || 0),
                lightingTax: Number(lightingTax || 0),
                healthTax: Number(healthTax || 0),
                educationTax: Number(educationTax || 0),
              },
            })
          }
        />
      </Section>
    </Screen>
  );
};
