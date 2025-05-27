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
			const active = offerings.current;
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
	}, []);

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
