import React, { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Badge, Button, Row, Screen, Section, Title } from '@/components/UI';
import { RootStackParamList } from '@/navigation/types';
import { getFlowStats } from '@/services/propertyService';

export const NumberingDashboardScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [stats, setStats] = useState({ total: 0, numbered: 0, surveyed: 0, taxed: 0 });

  useFocusEffect(
    useCallback(() => {
      getFlowStats().then(setStats);
    }, []),
  );

  return (
    <Screen>
      <Title>Numbering Dashboard</Title>
      <Section>
        <Row>
          <Badge text={`Expected: ${stats.total}`} />
          <Badge text={`Completed: ${stats.numbered}`} />
          <Badge text={`Remaining: ${Math.max(stats.total - stats.numbered, 0)}`} />
        </Row>
      </Section>
      <Button text="Open Property List" onPress={() => navigation.navigate('NumberingList')} />
      <Button text="Numbering Summary" variant="secondary" onPress={() => navigation.navigate('NumberingSummary')} />
      <Button text="Sync Data" variant="secondary" onPress={() => navigation.navigate('Sync')} />
    </Screen>
  );
};
