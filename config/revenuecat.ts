import { Platform } from "react-native";
import Purchases from "react-native-purchases";

/**
 * RevenueCat SDK keys – pulled from env so that no secrets ever live in VCS.
 */
export const REVENUECAT_IOS_API_KEY =
	process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? "";
export const REVENUECAT_ANDROID_API_KEY =
	process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? "";

/**
 * Initialise the RevenueCat SDK.
 * Returns `true` when configured, `false` when skipped or on error.
 */
export function configureRevenueCat(appUserId?: string | null): boolean {
	const apiKey =
		Platform.OS === "ios"
			? REVENUECAT_IOS_API_KEY
			: REVENUECAT_ANDROID_API_KEY;

	if (!apiKey) {
		console.warn(
			`[revenuecat] ${
				Platform.OS === "ios"
					? "EXPO_PUBLIC_REVENUECAT_IOS_KEY"
					: "EXPO_PUBLIC_REVENUECAT_ANDROID_KEY"
			} is not set – Purchases.configure() has been skipped.`,
		);
		return false;
	}

	try {
		Purchases.configure({
			apiKey,
			appUserID: appUserId ?? undefined,
		});
		return true;
	} catch (err) {
		console.error("[revenuecat] configure failed:", err);
		return false;
	}
}

/**
 * Simple runtime sanity-check so developers notice missing keys quickly.
 */
if (__DEV__) {
	if (Platform.OS === "ios" && !REVENUECAT_IOS_API_KEY) {
		console.warn(
			"[revenuecat] EXPO_PUBLIC_REVENUECAT_IOS_KEY is not set – RevenueCat SDK will fail to initialise on iOS.",
		);
	}
	if (Platform.OS === "android" && !REVENUECAT_ANDROID_API_KEY) {
		console.warn(
			"[revenuecat] EXPO_PUBLIC_REVENUECAT_ANDROID_KEY is not set – RevenueCat SDK will fail to initialise on Android.",
		);
	}
}
