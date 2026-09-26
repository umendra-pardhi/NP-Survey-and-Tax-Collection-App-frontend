import React, { useState } from 'react';
import { Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Input, Label, Screen, Section, Title } from '@/components/UI';
import { RootStackParamList } from '@/navigation/types';
import { addSurveyMember } from '@/services/surveyService';

type Props = NativeStackScreenProps<RootStackParamList, 'MemberEntry'>;

export const MemberEntryScreen = ({ route }: Props) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [relation, setRelation] = useState('');

  const onAdd = async () => {
    try {
      await addSurveyMember({
        propertyId: route.params.propertyId,
        name,
        age: Number(age || 0),
        relation,
      });
      setName('');
      setAge('');
      setRelation('');
      Alert.alert('Added', 'Member added to this survey.');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed');
    }
  };

  return (
    <Screen>
      <Title>Member Entry</Title>
      <Section>
        <Label>Name</Label>
        <Input value={name} onChangeText={setName} />
        <Label>Age</Label>
        <Input value={age} onChangeText={setAge} keyboardType="numeric" />
        <Label>Relation</Label>
        <Input value={relation} onChangeText={setRelation} />
        <Button text="Add Member" onPress={onAdd} />
      </Section>
    </Screen>
  );
};
