import React from "react";
import { View } from "react-native";
import { Alert, ActivityIndicator } from "react-native";
import Purchases from "react-native-purchases";
import { useNetInfo } from "@react-native-community/netinfo";

import { Paywall } from "@/components/Paywall";
import { REVENUECAT_IOS_API_KEY } from "@/config/revenuecat";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { useAuth } from "@/context/supabase-provider";

export default function Settings() {
	const { signOut } = useAuth();

	const [sdkReady, setSdkReady] = React.useState(false);
	const [initializing, setInitializing] = React.useState(false);
	const [isPaywallVisible, setPaywallVisible] = React.useState(false);

	const netInfo = useNetInfo();
	const isOffline = netInfo.isConnected === false;

	// --- RevenueCat initialisation ------------------------------------------------
	React.useEffect(() => {
		(async () => {
			// Fail fast when the API key is missing or empty
			if (!REVENUECAT_IOS_API_KEY) {
				Alert.alert(
					"Configuration Error",
					"Missing RevenueCat iOS API key. Please add REVENUECAT_IOS_API_KEY to your environment configuration.",
				);
				return;
			}
			try {
				await Purchases.configure({
					apiKey: REVENUECAT_IOS_API_KEY,
				});
				setSdkReady(true);
			} catch (e) {
				console.error("[revenuecat] configure failed", e);
				Alert.alert(
					"Purchase Error",
					"Unable to initialise the purchase SDK. Please try again later.",
				);
			}
		})();
	}, []);

	// --- Handlers -----------------------------------------------------------------
	const handleOpenPaywall = React.useCallback(async () => {
		if (initializing) return; // duplicate-tap guard
		if (isOffline) {
			Alert.alert(
				"Offline",
				"You appear to be offline. Connect to the internet and try again.",
			);
			return;
		}
		if (!sdkReady) {
			Alert.alert(
				"Please wait",
				"The purchase system is still initialising. Try again in a moment.",
			);
			return;
		}

		setInitializing(true);
		try {
			const offerings = await Purchases.getOfferings();
			if (!offerings.current || offerings.current.availablePackages.length === 0) {
				Alert.alert(
					"Unavailable",
					"No purchasable packages are currently available. Please try again later.",
				);
				return;
			}
			setPaywallVisible(true);
		} catch (error: any) {
			console.error("[revenuecat] getOfferings failed", error);
			Alert.alert(
				"Error",
				"Unable to load purchase options. Please try again later.",
			);
		} finally {
			setInitializing(false);
		}
	}, [initializing, isOffline, sdkReady]);

	return (
		<View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
			<H1 className="text-center">Purchases</H1>
			<Button
				onPress={handleOpenPaywall}
				className="w-full"
				disabled={initializing || isOffline || !sdkReady}
			>
				{initializing ? (
					<ActivityIndicator color="#fff" />
				) : (
					<Text>Open Paywall</Text>
				)}
			</Button>

			<H1 className="text-center">Sign Out</H1>
			<Muted className="text-center">
				Sign out and return to the welcome screen.
			</Muted>
			<Button
				className="w-full"
				size="default"
				variant="default"
				onPress={async () => {
					await signOut();
				}}
			>
				<Text>Sign Out</Text>
			</Button>

			{isPaywallVisible && (
				<Paywall
					entitlementKey="pro"
					onPurchaseComplete={() => {
						Alert.alert("Success", "Purchase completed successfully!");
						setPaywallVisible(false);
					}}
					onClose={() => setPaywallVisible(false)}
				/>
			)}
		</View>
	);
}
