import React from 'react';
import { PaywallView } from '@revenuecat/purchases-ui-react-native';
import { Platform, Text, View, StyleSheet } from 'react-native';

export const Paywall = () => {
  // According to RevenueCat docs, PaywallView currently only supports iOS and Android.
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
    return (
      <View style={styles.container}>
        <Text>The paywall is currently only available for iOS and Android.</Text>
      </View>
    );
  }

  return (
    <PaywallView 
      options={{ offering: null }} // Using null for 'offering' will display the default offering
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

export default Paywall;
