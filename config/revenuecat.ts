import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { Platform } from 'react-native';

// Use a placeholder for the API key.
// This will be replaced by the actual key from environment variables.
const REVENUECAT_API_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY || 'your_ios_api_key_placeholder';

/**
 * Initializes the RevenueCat SDK.
 * Call this function when your app starts.
 */
export const initializeRevenueCat = () => {
  if (Platform.OS === 'ios' && REVENUECAT_API_KEY_IOS !== 'your_ios_api_key_placeholder') {
    Purchases.configure({ apiKey: REVENUECAT_API_KEY_IOS });
    Purchases.setLogLevel(LOG_LEVEL.DEBUG); // Enable debug logs for development
    console.log('RevenueCat SDK configured for iOS.');
  } else if (Platform.OS === 'ios') {
    console.warn('RevenueCat iOS API key not found. Please set EXPO_PUBLIC_REVENUECAT_IOS_API_KEY.');
  }
  // Add Android configuration here if needed in the future
};

/**
 * Gets the available offerings (products/packages).
 */
export const getOfferings = async () => {
  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
      // Display current offering with offerings.current
      return offerings.current;
    }
    console.log('No current offerings found.');
    return null;
  } catch (e) {
    console.error('Error getting offerings:', e);
    return null;
  }
};

/**
 * Makes a purchase for the given package.
 * @param {Purchases.Package} pack The package to purchase.
 */
export const makePurchase = async (pack: Purchases.Package) => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pack);
    // Check customerInfo to see if the purchase was successful
    console.log('Purchase successful:', customerInfo);
    return { success: true, customerInfo };
  } catch (e: any) {
    if (!e.userCancelled) {
      console.error('Error making purchase:', e);
    } else {
      console.log('User cancelled purchase.');
    }
    return { success: false, userCancelled: e.userCancelled };
  }
};

/**
 * Restores purchases for the current user.
 */
export const restorePurchases = async () => {
  try {
    const customerInfo = await Purchases.restorePurchases();
    // Check customerInfo to see if the restore was successful
    console.log('Purchases restored:', customerInfo);
    return { success: true, customerInfo };
  } catch (e) {
    console.error('Error restoring purchases:', e);
    return { success: false };
  }
};

/**
 * Checks if the user has an active subscription for a specific entitlement.
 * This example uses a "default" entitlement identifier.
 * Replace 'default_entitlement_identifier' with your actual default entitlement ID from RevenueCat.
 * @param {string} entitlementId The entitlement identifier (e.g., 'premium', 'pro'). Defaults to 'default_entitlement_identifier'.
 */
export const hasActiveSubscription = async (entitlementId: string = 'default_entitlement_identifier') => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    if (typeof customerInfo.entitlements.active[entitlementId] !== 'undefined') {
      console.log(`User has active entitlement: ${entitlementId}`);
      return true;
    }
    console.log(`User does not have active entitlement: ${entitlementId}`);
    return false;
  } catch (e) {
    console.error('Error checking subscription status:', e);
    return false;
  }
};

// It's good practice to initialize RevenueCat early in your app's lifecycle.
// For example, in your main App.tsx or _layout.tsx.
// We will call initializeRevenueCat() in the root _layout.tsx later.
