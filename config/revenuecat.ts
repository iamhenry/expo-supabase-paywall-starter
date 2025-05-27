import Purchases from "react-native-purchases";

/**
 * RevenueCat SDK key – pulled from env so that no secrets ever live in VCS.
 */
export const REVENUECAT_IOS_API_KEY =
	process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? "";

/**
 * Initialise the RevenueCat SDK.
 * Call this once, as early as possible in your app start-up.
 */
export function configureRevenueCat(appUserId?: string | null) {
	if (!REVENUECAT_IOS_API_KEY) {
		console.warn(
			"[revenuecat] EXPO_PUBLIC_REVENUECAT_IOS_KEY is not set – " +
				"Purchases.configure() has been skipped.",
		);
		return;
	}

	Purchases.configure({
		apiKey: REVENUECAT_IOS_API_KEY,
		appUserID: appUserId ?? undefined,
	});
}

/**
 * Simple runtime sanity-check so developers notice missing keys quickly.
 */
if (__DEV__ && !REVENUECAT_IOS_API_KEY) {
	console.warn(
		"[revenuecat] EXPO_PUBLIC_REVENUECAT_IOS_KEY is not set – " +
			"RevenueCat SDK will fail to initialise.",
	);
}
