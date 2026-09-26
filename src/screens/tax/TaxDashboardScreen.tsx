import React, { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Badge, Button, Row, Screen, Section, Title } from '@/components/UI';
import { RootStackParamList } from '@/navigation/types';
import { getFlowStats } from '@/services/propertyService';

export const TaxDashboardScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [stats, setStats] = useState({ total: 0, numbered: 0, surveyed: 0, taxed: 0 });

  useFocusEffect(
    useCallback(() => {
      getFlowStats().then(setStats);
    }, []),
  );
  const pending = Math.max(stats.total - stats.taxed, 0);
  return (
    <Screen>
      <Title>Tax Dashboard</Title>
      <Section>
        <Row>
          <Badge text={`Demand: ${stats.total}`} />
          <Badge text={`Received: ${stats.taxed}`} />
          <Badge text={`Remaining: ${pending}`} />
        </Row>
      </Section>
      <Button text="Property Search" onPress={() => navigation.navigate('TaxSearch')} />
      <Button text="Sync Data" variant="secondary" onPress={() => navigation.navigate('Sync')} />
    </Screen>
  );
};
