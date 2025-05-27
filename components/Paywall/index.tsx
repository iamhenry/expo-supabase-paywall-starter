import * as React from "react";
import { ActivityIndicator, View } from "react-native";
import Purchases from "react-native-purchases";
import { Paywall as RCUIPaywall } from "react-native-purchases-ui";

/**
 * Extremely small convenience wrapper around `react-native-purchases-ui`’s
 * Paywall that:
 *  1. Fetches the active offering for a given entitlement key.
 *  2. Grabs the latest `CustomerInfo` so the Paywall can determine purchase
 *     status.
 *  3. Shows a default close button.
 *
 * NOTE: This is intentionally minimal-–adapt freely for your own needs.
 */
type PaywallProps = {
	entitlementKey: string;
	onPurchaseComplete?: (info: unknown) => void;
	onClose?: () => void;
};

export function Paywall({
	entitlementKey,
	onPurchaseComplete,
	onClose,
}: PaywallProps) {
	const [paywall, setPaywall] = React.useState<any>(null);
	const [customerInfo, setCustomerInfo] = React.useState<any>(null);

	React.useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const offerings = await Purchases.getOfferings();
				const active = offerings.current;
				if (!mounted) return;

				if (!active) {
					console.warn(
						"[Paywall] No active offering found while trying to render paywall.",
					);
					onClose?.();
					return;
				}
				setPaywall(active);
				const info = await Purchases.getCustomerInfo();
				if (!mounted) return;
				setCustomerInfo(info);
			} catch (error) {
				console.error("[Paywall] Failed to load RevenueCat data:", error);
				onClose?.();
			}
		})();
		return () => {
			mounted = false;
		};
	}, [entitlementKey]);

	if (!paywall || !customerInfo) {
		return (
			<View className="flex-1 items-center justify-center">
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<RCUIPaywall
			customerInfo={customerInfo}
			paywall={paywall}
			closeButton
			onPurchaseCompleted={(info: unknown) => {
				onPurchaseComplete?.(info);
			}}
			onClose={onClose}
		/>
	);
}
