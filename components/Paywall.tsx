import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { Paywall } from 'react-native-purchases-ui';
import { restorePurchases } from '../config/revenuecat'; // Note: 'customerInfo' was misspelled in the original snippet, assuming 'customerInfo' is intended from react-native-purchases. Correcting to a more generic 'getCustomerInfo' or similar might be better if this is not a direct import.
// Assuming 'restorePurchases' and a method to get customer info are correctly exported from '../config/revenuecat'

// For the purpose of this boilerplate, we'll use a direct import of Purchases to access customerInfo for simplicity in the UI component.
// It's generally better to abstract these calls into your revenuecat.ts as well.
import Purchases, { PurchasesOffering } from 'react-native-purchases';


interface PaywallComponentProps {
  onPurchaseCompleted?: (customerInfo: Purchases.CustomerInfo) => void;
  onRestoreCompleted?: (customerInfo: Purchases.CustomerInfo) => void;
  onPurchaseCancelled?: () => void;
  onError?: (error: any) => void; // More specific error type can be used
}

const PaywallComponent: React.FC<PaywallComponentProps> = ({
  onPurchaseCompleted,
  onRestoreCompleted,
  onPurchaseCancelled,
  onError,
}) => {
  const [currentOffering, setCurrentOffering] = React.useState<PurchasesOffering | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchOffering = async () => {
      try {
        const offerings = await Purchases.getOfferings();
        if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
          setCurrentOffering(offerings.current);
        } else {
          console.log("No current offerings found for Paywall component.");
        }
      } catch (e) {
        console.error("Error fetching offerings for Paywall component:", e);
        if (onError) onError(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffering();
  }, [onError]);

  const handleRestore = async () => {
    setIsLoading(true);
    try {
      const { customerInfo, success } = await restorePurchases();
      if (success && customerInfo) {
        console.log('Restore successful from PaywallComponent');
        if (onRestoreCompleted) onRestoreCompleted(customerInfo);
      } else {
        console.log('Restore failed or no purchases to restore from PaywallComponent');
        // Optionally, call onError or a specific onRestoreFailed callback
      }
    } catch (e) {
      console.error('Error during restore process in PaywallComponent:', e);
      if (onError) onError(e);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading Subscriptions...</Text>
      </View>
    );
  }

  if (!currentOffering) {
    return (
      <View style={styles.centered}>
        <Text>No subscription plans are currently available.</Text>
        <Button title="Try Restoring Purchases" onPress={handleRestore} />
      </View>
    );
  }

  return (
    <Paywall
      options={{
        offering: currentOffering,
        // Optional: if you want to display a dismiss button
        // displayDismissButton: true, 
      }}
      onPurchaseCompleted={(result) => {
        console.log('Purchase completed from UI:', result.customerInfo);
        if (onPurchaseCompleted) onPurchaseCompleted(result.customerInfo);
      }}
      onPurchaseCancelled={() => {
        console.log('Purchase cancelled from UI');
        if (onPurchaseCancelled) onPurchaseCancelled();
      }}
      onRestoreCompleted={(result) => {
        // This callback from react-native-purchases-ui Paywall might be what you need for restores initiated from the UI
        console.log('Restore completed from UI:', result.customerInfo);
        if (onRestoreCompleted) onRestoreCompleted(result.customerInfo);
      }}
      // The Paywall component itself might not have a direct onError prop like this.
      // Error handling for fetching offerings is done above.
      // Errors during purchase/restore are typically handled by onPurchaseError or by catching exceptions if you call purchase methods directly.
      // For simplicity, we're relying on the console logs and the component's own error displays.
    />
    // You might want to add a manual restore button if not provided by the RevenueCat UI Paywall,
    // or if users encounter issues.
    // <Button title="Restore Purchases" onPress={handleRestore} /> 
    // The above button is commented out as the Paywall UI usually includes a restore mechanism.
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default PaywallComponent;
