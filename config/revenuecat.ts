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
 * Initialise the RevenueCat SDK for the current platform.
 * Call this once, as early as possible in your app start-up.
 */
export function configureRevenueCat(appUserId?: string | null) {
	const apiKey =
		Platform.OS === "ios"
			? REVENUECAT_IOS_API_KEY
			: Platform.OS === "android"
				? REVENUECAT_ANDROID_API_KEY
				: "";

	if (!apiKey) {
		console.warn(
			`[revenuecat] No API key configured for ${Platform.OS}. ` +
				"Purchases.configure() has been skipped.",
		);
		return;
	}

	Purchases.configure({ apiKey, appUserID: appUserId ?? undefined });
}

/**
 * Simple runtime sanity-check so developers notice missing keys quickly.
 */
if (__DEV__) {
	if (Platform.OS === "ios" && !REVENUECAT_IOS_API_KEY) {
		console.warn(
			"[revenuecat] EXPO_PUBLIC_REVENUECAT_IOS_KEY is not set – " +
				"RevenueCat SDK will fail to initialise on iOS.",
		);
	}
	if (Platform.OS === "android" && !REVENUECAT_ANDROID_API_KEY) {
		console.warn(
			"[revenuecat] EXPO_PUBLIC_REVENUECAT_ANDROID_KEY is not set – " +
				"RevenueCat SDK will fail to initialise on Android.",
		);
	}
}
