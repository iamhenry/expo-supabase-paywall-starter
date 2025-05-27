# 🛒 Subscriptions & Paywall (RevenueCat)

This project uses [RevenueCat](https://www.revenuecat.com/) to handle in-app
purchases and subscriptions. The integration covers:

1. SDK initialisation (`configureRevenueCat`).
2. Paywall UI with loading, error and retry handling.
3. Remote-config overrides so that marketing copy can be A/B-tested without a
   new binary.

## Configuration

1. Create a public iOS SDK key in the RevenueCat dashboard.
2. Copy them into your local `.env`:

   ```bash
   cp .env.example .env
   # then edit the file
   ```

3. Re-build your dev client or EAS build – the keys are injected by the
   `react-native-purchases` Expo config plugin.

## Usage

At your app’s entry point:

```ts
import { configureRevenueCat } from "@/config/revenuecat";

configureRevenueCat(/* optional: yourAppUserId */);
```

Render the paywall anywhere:

```tsx
import { Paywall } from "@/components/Paywall";

<Paywall
  entitlementKey="pro"
  overrides={{ headline: "👑 Go Pro today!" }}
  onClose={() => router.back()}
/>
```

## Troubleshooting

* **Blank paywall / only loading spinner** – No *current offering* is marked in
  the RevenueCat dashboard.  
* **SDK not initialised** – Check the runtime warnings in Metro logs; your env
  vars may be missing.
