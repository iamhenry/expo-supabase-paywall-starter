/**
 * RevenueCat configuration
 * Reads the iOS API key from the environment so secrets never live in source.
 * Configure additional platforms (android, web) here if/when they are needed.
 */
export const REVENUECAT_IOS_API_KEY =
	process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? "";

/**
 * A very naive runtime check so developers notice missing env-vars early.
 * In production you will likely want something more sophisticated.
 */
if (!REVENUECAT_IOS_API_KEY) {
	console.warn(
		"[revenuecat] EXPO_PUBLIC_REVENUECAT_IOS_KEY is not set – " +
			"RevenueCat SDK will fail to initialise.",
	);
}
