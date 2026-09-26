import React from 'react';
import { Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '@/context/AuthContext';
import { RootStackParamList } from '@/navigation/types';
import { SplashScreen } from '@/screens/SplashScreen';
import { SetupScreen } from '@/screens/SetupScreen';
import { LoginScreen } from '@/screens/LoginScreen';
import { AdminDashboardScreen } from '@/screens/admin/AdminDashboardScreen';
import { UserCreationScreen } from '@/screens/UserCreationScreen';
import { ReportsScreen } from '@/screens/ReportsScreen';
import { SyncScreen } from '@/screens/common/SyncScreen';
import { NumberingDashboardScreen } from '@/screens/numbering/NumberingDashboardScreen';
import { NumberingListScreen } from '@/screens/numbering/NumberingListScreen';
import { NumberingFormScreen } from '@/screens/numbering/NumberingFormScreen';
import { NumberingSummaryScreen } from '@/screens/numbering/NumberingSummaryScreen';
import { SurveyDashboardScreen } from '@/screens/survey/SurveyDashboardScreen';
import { SurveySearchScreen } from '@/screens/survey/SurveySearchScreen';
import { SurveyFormScreen } from '@/screens/survey/SurveyFormScreen';
import { MemberEntryScreen } from '@/screens/MemberEntryScreen';
import { SurveySummaryScreen } from '@/screens/survey/SurveySummaryScreen';
import { TaxDashboardScreen } from '@/screens/tax/TaxDashboardScreen';
import { TaxSearchScreen } from '@/screens/tax/TaxSearchScreen';
import { TaxDetailsScreen } from '@/screens/tax/TaxDetailsScreen';
import { TaxEntryScreen } from '@/screens/tax/TaxEntryScreen';
import { PaymentScreen } from '@/screens/PaymentScreen';
import { ReceiptScreen } from '@/screens/ReceiptScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { loading, isSetupDone, user, logout } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  const screenOptions = user
    ? {
        headerRight: () => <Button title="Logout" onPress={() => logout()} />,
      }
    : undefined;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        {!isSetupDone ? (
          <Stack.Screen name="Setup" component={SetupScreen} />
        ) : !user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="UserCreation" component={UserCreationScreen} />
          </>
        ) : user.role === 'ADMIN' ? (
          <>
            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
            <Stack.Screen name="UserCreation" component={UserCreationScreen} />
            <Stack.Screen name="Reports" component={ReportsScreen} />
            <Stack.Screen name="Sync" component={SyncScreen} />
          </>
        ) : user.role === 'NUMBERING' ? (
          <>
            <Stack.Screen name="NumberingDashboard" component={NumberingDashboardScreen} />
            <Stack.Screen name="NumberingList" component={NumberingListScreen} />
            <Stack.Screen name="NumberingForm" component={NumberingFormScreen} />
            <Stack.Screen name="NumberingSummary" component={NumberingSummaryScreen} />
            <Stack.Screen name="Sync" component={SyncScreen} />
          </>
        ) : user.role === 'SURVEY' ? (
          <>
            <Stack.Screen name="SurveyDashboard" component={SurveyDashboardScreen} />
            <Stack.Screen name="SurveySearch" component={SurveySearchScreen} />
            <Stack.Screen name="SurveyForm" component={SurveyFormScreen} />
            <Stack.Screen name="MemberEntry" component={MemberEntryScreen} />
            <Stack.Screen name="SurveySummary" component={SurveySummaryScreen} />
            <Stack.Screen name="Sync" component={SyncScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="TaxDashboard" component={TaxDashboardScreen} />
            <Stack.Screen name="TaxSearch" component={TaxSearchScreen} />
            <Stack.Screen name="TaxDetails" component={TaxDetailsScreen} />
            <Stack.Screen name="TaxEntry" component={TaxEntryScreen} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
            <Stack.Screen name="Receipt" component={ReceiptScreen} />
            <Stack.Screen name="Sync" component={SyncScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
