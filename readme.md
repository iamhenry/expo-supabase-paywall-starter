# Expo Supabase Starter

![social-preview-dark](https://github.com/user-attachments/assets/9697a7da-10aa-4661-bb76-b5bc0dd611f0)

## Introduction

This repository serves as a comprehensive starter project for developing React Native and Expo applications with Supabase as the backend. It integrates various technologies such as Expo Router for navigation, Tailwind CSS for styling, React-Hook-Form for form handling, Zod for schema validation, and TypeScript for type safety. By leveraging these powerful tools, this starter template provides a robust foundation for building modern, scalable, and efficient mobile applications.

#### Disclaimer

This is not supposed to be a template, boilerplate or a framework. It is an opinionated guide that shows how to do some things in a certain way. You are not forced to do everything exactly as it is shown here, decide what works best for you and your team and stay consistent with your style.

## Table of Contents

- [💻 Application Overview](docs/application-overview.md)
- [⚙️ Project Configuration](docs/project-configuration.md)
- [🗄️ Project Structure](docs/project-structure.md)
- [🧱 Components And Styling](docs/components-and-styling.md)
- [🗃️ State Management](docs/state-management.md)

## Contributing

Contributions to this starter project are highly encouraged and welcome! If you have any suggestions, bug reports, or feature requests, please feel free to create an issue or submit a pull request. Let's work together to enhance the developer experience and make it easier for everyone to build exceptional Expo applications with Supabase.

## License

This repository is licensed under the MIT License. You are granted the freedom to use, modify, and distribute the code for personal or commercial purposes. For more details, please refer to the [LICENSE](https://github.com/FlemingVincent/supabase-starter/blob/main/LICENSE) file.

## RevenueCat In-App Purchase Integration

This project integrates RevenueCat for managing in-app purchases, specifically configured for iOS.

### Configuration

1.  **API Key**: You need to set your RevenueCat iOS API key in your local environment. Create a `.env` file in the root of the project (if you don't have one already) and add your key:
    ```
    EXPO_PUBLIC_REVENUECAT_IOS_API_KEY=your_actual_ios_api_key
    ```
    Replace `your_actual_ios_api_key` with the key obtained from your RevenueCat dashboard (e.g., `appl_...`).
    The `EXPO_PUBLIC_` prefix makes the environment variable accessible in the client-side Expo application.

2.  **Entitlement Identifier**: The `config/revenuecat.ts` file contains a helper function `hasActiveSubscription` which checks for a default entitlement.
    ```typescript
    export const hasActiveSubscription = async (entitlementId: string = 'default_entitlement_identifier') => {
      // ...
    }
    ```
    You should replace `'default_entitlement_identifier'` with the actual ID of your default entitlement configured in RevenueCat (e.g., `premium`, `pro_access`).

### Usage

A paywall component is available at `components/Paywall.tsx`. This component uses `react-native-purchases-ui` to display available subscription offerings.

An example integration of this paywall is available in the Settings tab (`app/(protected)/(tabs)/settings.tsx`). A button "View Subscription Options" triggers a modal displaying the paywall.

**Key Files:**
*   `config/revenuecat.ts`: Contains RevenueCat SDK initialization, API key configuration (via environment variable), and helper functions for purchases, restores, and checking subscription status.
*   `components/Paywall.tsx`: The reusable UI component for displaying the paywall.
*   `app/(protected)/(tabs)/settings.tsx`: Example usage of the paywall component.
*   `app/_layout.tsx`: Initializes the RevenueCat SDK when the app starts.

### Placeholders
Remember to replace placeholder values:
- `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY` in your `.env` file.
- The default entitlement identifier in `config/revenuecat.ts` if you use a different one.
