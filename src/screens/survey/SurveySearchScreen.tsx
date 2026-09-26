import React, { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Input, Label, Section, Title } from '@/components/UI';
import { RootStackParamList } from '@/navigation/types';
import { searchProperties } from '@/services/propertyService';
import { PropertyRow } from '@/types';

export const SurveySearchScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [wardNo, setWardNo] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [propertyNo, setPropertyNo] = useState('');
  const [rows, setRows] = useState<PropertyRow[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const runSearch = async () => {
    setRows(await searchProperties({ wardNo, ownerName, propertyNo }));
    setHasSearched(true);
  };

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: '#F6F7FB' }}
      contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
      data={rows}
      keyExtractor={(item) => String(item.id)}
      ListHeaderComponent={
        <View style={{ gap: 12, marginBottom: 12 }}>
          <Title>Property Search (Survey)</Title>
          <Section>
            <Label>Ward No</Label>
            <Input value={wardNo} onChangeText={setWardNo} />
            <Label>Property No</Label>
            <Input value={propertyNo} onChangeText={setPropertyNo} />
            <Label>Owner Name</Label>
            <Input value={ownerName} onChangeText={setOwnerName} />
            <Pressable onPress={runSearch} style={{ backgroundColor: '#145DA0', borderRadius: 10, padding: 12 }}>
              <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>Search</Text>
            </Pressable>
          </Section>
        </View>
      }
      renderItem={({ item }) => (
        <Section>
          <Pressable onPress={() => navigation.navigate('SurveyForm', { propertyId: item.id })} style={{ paddingVertical: 8 }}>
            <Text style={{ fontWeight: '700' }}>{item.property_no}</Text>
            <Text>{item.owner_name}</Text>
          </Pressable>
        </Section>
      )}
      ListEmptyComponent={
        hasSearched ? (
          <Section>
            <Text style={{ textAlign: 'center', color: '#555' }}>No records found.</Text>
          </Section>
        ) : null
      }
      ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
    />
  );
};
