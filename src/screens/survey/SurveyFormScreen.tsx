import React, { useEffect, useState } from 'react';
import { Alert, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '@/context/AuthContext';
import { Button, Input, Label, Screen, Section, Title } from '@/components/UI';
import { RootStackParamList } from '@/navigation/types';
import { getPropertyById } from '@/services/propertyService';
import { saveSurvey } from '@/services/surveyService';
import { PropertyRow } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SurveyForm'>;

export const SurveyFormScreen = ({ route, navigation }: Props) => {
  const { user } = useAuth();
  const [property, setProperty] = useState<PropertyRow | null>(null);
  const [mobile, setMobile] = useState('');
  const [tenantInfo, setTenantInfo] = useState('');

  useEffect(() => {
    getPropertyById(route.params.propertyId).then((p) => setProperty(p ?? null));
  }, [route.params.propertyId]);

  const submit = async (isDraft: number) => {
    try {
      if (!user || !property) return;
      await saveSurvey({
        propertyId: property.id,
        surveyorId: user.id,
        mobile,
        tenantInfo,
        isDraft,
      });
      Alert.alert('Saved', isDraft ? 'Draft saved' : 'Survey submitted');
      if (!isDraft) navigation.navigate('SurveySummary');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Save failed');
    }
  };

  return (
    <Screen>
      <Title>Survey Form</Title>
      <Section>
        <Text>Owner: {property?.owner_name}</Text>
        <Text>Property No: {property?.property_no}</Text>
        <Text>Address: {property?.address}</Text>
      </Section>
      <Section>
        <Label>Mobile Number</Label>
        <Input value={mobile} onChangeText={setMobile} keyboardType="numeric" />
        <Label>Tenant Info</Label>
        <Input value={tenantInfo} onChangeText={setTenantInfo} placeholder="Tenant name/details" />
        <Button text="Save Draft" variant="secondary" onPress={() => submit(1)} />
        <Button text="Add Members" variant="secondary" onPress={() => navigation.navigate('MemberEntry', { propertyId: route.params.propertyId })} />
        <Button text="Submit Survey" onPress={() => submit(0)} />
      </Section>
    </Screen>
  );
};
