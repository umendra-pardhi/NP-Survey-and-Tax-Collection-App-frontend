import React from 'react';
import { ActivityIndicator, View } from 'react-native';

export const SplashScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" />
  </View>
);
