import { Platform } from "react-native";
import Purchases from "react-native-purchases";

/**
 * RevenueCat SDK key – pulled from env so that no secrets ever live in VCS.
 * Android support has been removed; the SDK is now initialised only on iOS.
 */
export const REVENUECAT_IOS_API_KEY =
	process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? "";

/**
 * Initialise the RevenueCat SDK (iOS only).
 * Returns `true` when configured, `false` when skipped or on error.
 */
export function configureRevenueCat(appUserId?: string | null): boolean {
	if (Platform.OS !== "ios") {
		// No-op on other platforms.
		return false;
	}

	if (!REVENUECAT_IOS_API_KEY) {
		console.warn(
			"[revenuecat] EXPO_PUBLIC_REVENUECAT_IOS_KEY is not set – Purchases.configure() has been skipped.",
		);
		return false;
	}

	try {
		Purchases.configure({
			apiKey: REVENUECAT_IOS_API_KEY,
			appUserID: appUserId ?? undefined,
		});
		return true;
	} catch (err) {
		console.error("[revenuecat] configure failed:", err);
		return false;
	}
}

/**
 * Simple runtime sanity-check so developers notice a missing key quickly.
 */
if (__DEV__ && Platform.OS === "ios" && !REVENUECAT_IOS_API_KEY) {
	console.warn(
		"[revenuecat] EXPO_PUBLIC_REVENUECAT_IOS_KEY is not set – RevenueCat SDK will fail to initialise on iOS.",
	);
}
