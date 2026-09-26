import React, { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Badge, Button, Row, Screen, Section, Title } from '@/components/UI';
import { RootStackParamList } from '@/navigation/types';
import { getFlowStats } from '@/services/propertyService';

export const SurveyDashboardScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [stats, setStats] = useState({ total: 0, numbered: 0, surveyed: 0, taxed: 0 });

  useFocusEffect(
    useCallback(() => {
      getFlowStats().then(setStats);
    }, []),
  );

  return (
    <Screen>
      <Title>Survey Dashboard</Title>
      <Section>
        <Row>
          <Badge text={`Assigned: ${stats.total}`} />
          <Badge text={`Completed: ${stats.surveyed}`} />
          <Badge text={`Remaining: ${Math.max(stats.total - stats.surveyed, 0)}`} />
        </Row>
      </Section>
      <Button text="Property Search" onPress={() => navigation.navigate('SurveySearch')} />
      <Button text="Survey Summary" variant="secondary" onPress={() => navigation.navigate('SurveySummary')} />
      <Button text="Sync Data" variant="secondary" onPress={() => navigation.navigate('Sync')} />
    </Screen>
  );
};
