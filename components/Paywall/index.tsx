import * as React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import Purchases from "react-native-purchases";
import { Paywall as RCUIPaywall } from "react-native-purchases-ui";

type PaywallState = "loading" | "ready" | "error";

type PaywallProps = {
	/**
	 * Entitlement the user should receive after purchasing.
	 */
	entitlementKey: string;
	/**
	 * Remote config overrides – injected into the RC paywall for dynamic copy.
	 */
	overrides?: Record<string, string>;
	onPurchaseComplete?: (info: unknown) => void;
	onClose?: () => void;
};

/**
 * Full-screen RevenueCat paywall wrapper that handles all data-fetching and
 * error/placeholder UI states before delegating the actual rendering to
 * `react-native-purchases-ui`.
 *
 * Props
 * -----
 * entitlementKey       Entitlement expected to be unlocked after purchase.
 * overrides            Optional remote-config overrides injected into the paywall.
 * onPurchaseComplete   Callback fired after a successful purchase and receipt sync.
 * onClose              Callback fired when the user dismisses the paywall.
 *
 * Example
 * -------
 * ```tsx
 * <Paywall
 *   entitlementKey="pro"
 *   overrides={{ title: "Go Pro" }}
 *   onPurchaseComplete={(info) => console.log("Purchased!", info)}
 *   onClose={() => router.back()}
 * />
 * ```
 */
export function Paywall({
	entitlementKey,
	overrides,
	onPurchaseComplete,
	onClose,
}: PaywallProps) {
	const [paywall, setPaywall] = React.useState<any>(null);
	const [customerInfo, setCustomerInfo] = React.useState<any>(null);
	const [state, setState] = React.useState<PaywallState>("loading");
	const [error, setError] = React.useState<unknown>(null);

	const fetchData = React.useCallback(async () => {
		setState("loading");
		setError(null);

		try {
			const offerings = await Purchases.getOfferings();

			// Try to find an offering that matches the requested entitlement.
			const active =
				// Look through all available offerings for a match.
				Object.values(offerings.all ?? {}).find((offering: any) => {
					const metaEntitlementId =
						(offering.metadata as any)?.entitlement?.identifier;
					return (
						metaEntitlementId === entitlementKey ||
						offering.identifier === entitlementKey
					);
				}) ??
				// Fallback to the currently‐active offering.
				offerings.current;
			if (!active) {
				throw new Error(
					"No active offering found while trying to render paywall.",
				);
			}
			setPaywall(active);
			const info = await Purchases.getCustomerInfo();
			setCustomerInfo(info);
			setState("ready");
		} catch (err) {
			console.error("[Paywall] Failed to load RevenueCat data:", err);
			setError(err);
			setState("error");
		}
	}, [entitlementKey]);

	React.useEffect(() => {
		/* Fetch data on mount and whenever a different entitlement is requested */
		fetchData();
	}, [entitlementKey, fetchData]);

	/* ─────────────────────── Render helpers ─────────────────────── */

	if (state === "loading") {
		return (
			<View className="flex-1 items-center justify-center">
				<ActivityIndicator />
			</View>
		);
	}

	if (state === "error") {
		return (
			<View className="flex-1 items-center justify-center gap-y-4 px-6">
				<Text className="text-center text-base font-semibold">
					Something went wrong while loading the paywall.
				</Text>
				{error instanceof Error && (
					<Text className="text-center text-xs opacity-60">
						{error.message}
					</Text>
				)}
				<Pressable
					className="rounded-md bg-black/90 px-4 py-2"
					onPress={fetchData}
				>
					<Text className="text-white font-medium">Try again</Text>
				</Pressable>
				<Pressable className="mt-2" onPress={onClose}>
					<Text className="text-sm underline">Close</Text>
				</Pressable>
			</View>
		);
	}

	/* state === "ready" */
	const props: any = {
		customerInfo,
		paywall,
		closeButton: true,
		onPurchaseCompleted: onPurchaseComplete,
		onClose,
	};

	if (overrides) {
		// `remoteConfigOverrides` is still untyped in @types so we keep it loose.
		props.remoteConfigOverrides = overrides;
	}

	return <RCUIPaywall {...props} />;
}
