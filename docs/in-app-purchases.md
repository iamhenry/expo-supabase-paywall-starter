# In-App Purchases with RevenueCat

This project uses [RevenueCat](https://www.revenuecat.com/) to manage in-app purchases and subscriptions. This document provides an overview of how it's integrated and how to configure and use the paywall.

## RevenueCat Configuration

RevenueCat is initialized when the application starts. The configuration is handled in `config/revenuecat.ts`.

**Important:** Before you can use in-app purchases, you **must** replace the placeholder API keys in `config/revenuecat.ts` with your actual API keys from your RevenueCat dashboard.

```typescript
// In config/revenuecat.ts
const API_KEYS = {
  apple: 'YOUR_APPLE_API_KEY', // Replace with your actual Apple API key
  google: 'YOUR_GOOGLE_API_KEY', // Replace with your actual Google API key
};
```

Failure to update these keys will prevent RevenueCat from working correctly.

## Paywall Component

A reusable Paywall component is available at `components/paywall.tsx`.

This component uses the `PaywallView` from `react-native-purchases-ui` to display the default offering configured in your RevenueCat dashboard. 

The `PaywallView` handles the presentation of available products and the purchase flow. The current implementation displays the *default* offering, but it can be customized to show specific offerings if needed by modifying the `options` prop passed to `PaywallView`.

The component is designed to be easily inserted into various parts of the application, such as:
- An onboarding flow for new users.
- A dedicated "Go Premium" or "Subscribe" screen.
- Modally when a user tries to access a premium feature.

## Displaying the Paywall

To display the paywall, you can import and use the `<Paywall />` component. 

An example screen is provided at `app/paywall-screen.tsx`, which demonstrates how to render the component within a `SafeAreaView`.

```tsx
// Example usage in a screen component:
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Paywall from '../components/paywall'; // Adjust path as needed
import { SafeAreaView } from '../components/safe-area-view'; // Adjust path as needed

const MyScreenWithPaywall = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Other screen content */}
      <Paywall />
      {/* Other screen content */}
    </SafeAreaView>
  );
};

export default MyScreenWithPaywall;
```

Simply include the `<Paywall />` component wherever you need to present purchasing options to the user.

## Testing In-App Purchases

Testing in-app purchases involves several steps outside of this application's codebase:

1.  **Sandbox Environments**: You need to set up sandbox testing accounts in App Store Connect (for iOS) and Google Play Console (for Android).
2.  **Product Configuration**: Define your in-app products (subscriptions, one-time purchases) in both the respective app store consoles and in your RevenueCat dashboard.
3.  **RevenueCat Setup**: Ensure your offerings and products are correctly configured in RevenueCat.

For detailed instructions on testing, please refer to the official RevenueCat documentation:
[Testing and Launching with RevenueCat (Sandbox Testing)](https://www.revenuecat.com/docs/test-and-launch/sandbox)

Remember to build your app in a release or test configuration that allows for sandbox purchases, and use your sandbox tester accounts on your test devices.
