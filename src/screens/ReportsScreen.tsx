import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Badge, Row, Screen, Section, Title } from '@/components/UI';
import { getFlowStats } from '@/services/propertyService';

export const ReportsScreen = () => {
  const [stats, setStats] = useState({ total: 0, numbered: 0, surveyed: 0, taxed: 0 });
  useFocusEffect(
    useCallback(() => {
      getFlowStats().then(setStats);
    }, []),
  );
  return (
    <Screen>
      <Title>Reports</Title>
      <Section>
        <Row>
          <Badge text={`Numbering Report: ${stats.numbered}/${stats.total}`} />
          <Badge text={`Survey Report: ${stats.surveyed}/${stats.total}`} />
          <Badge text={`Tax Report: ${stats.taxed}/${stats.total}`} />
        </Row>
      </Section>
    </Screen>
  );
};
