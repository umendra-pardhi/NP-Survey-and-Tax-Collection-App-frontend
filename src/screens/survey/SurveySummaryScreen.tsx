import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Badge, Row, Screen, Section, Title } from '@/components/UI';
import { getFlowStats } from '@/services/propertyService';

export const SurveySummaryScreen = () => {
  const [stats, setStats] = useState({ total: 0, numbered: 0, surveyed: 0, taxed: 0 });
  useFocusEffect(
    useCallback(() => {
      getFlowStats().then(setStats);
    }, []),
  );
  return (
    <Screen>
      <Title>Survey Summary</Title>
      <Section>
        <Row>
          <Badge text={`Total: ${stats.total}`} />
          <Badge text={`Survey Done: ${stats.surveyed}`} />
          <Badge text={`Pending: ${Math.max(stats.total - stats.surveyed, 0)}`} />
        </Row>
      </Section>
    </Screen>
  );
};
