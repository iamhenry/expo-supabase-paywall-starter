import React from 'react';
import { View, StyleSheet } from 'react-native';
import Paywall from '../components/paywall'; // Adjusted path to be relative from app/
import { SafeAreaView } from '../components/safe-area-view'; // Adjusted path to be relative from app/

const PaywallScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Paywall />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PaywallScreen;
