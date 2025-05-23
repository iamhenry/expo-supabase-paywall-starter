import React, { useState } from 'react';
import { View, Modal, StyleSheet, Platform, ScrollView } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text"; // Assuming Text component can be child of Button
import { H1, Muted } from "@/components/ui/typography";
import { useAuth } from "@/context/supabase-provider";
import PaywallComponent from '../../../../components/Paywall'; // Corrected path
import type { CustomerInfo } from 'react-native-purchases';

export default function Settings() {
	const { signOut } = useAuth();
	const [isPaywallVisible, setIsPaywallVisible] = useState(false);

	const handlePurchaseCompleted = (customerInfo: CustomerInfo) => {
		console.log("Purchase completed in settings:", customerInfo.originalAppUserId);
		setIsPaywallVisible(false); // Close paywall after purchase
	};

	const handleRestoreCompleted = (customerInfo: CustomerInfo) => {
		console.log("Restore completed in settings:", customerInfo.originalAppUserId);
		setIsPaywallVisible(false); // Close paywall after restore
	};
	
	const handlePurchaseCancelled = () => {
		console.log("Purchase cancelled in settings.");
	};

	const handleError = (error: any) => {
		console.error("Error in Paywall from settings:", error);
		setIsPaywallVisible(false); // Close paywall on error
	};

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
			<View className="p-4 gap-y-4 w-full">
				<View className="items-center">
					<H1 className="text-center">Settings</H1>
				</View>

				<View style={styles.section}>
					<H1 className="text-center mb-2">Manage Subscription</H1>
					<Muted className="text-center mb-4">
						View subscription options or restore your purchases.
					</Muted>
					<Button
						className="w-full"
						size="default"
						variant="default"
						onPress={() => setIsPaywallVisible(true)}
					>
						<Text>View Subscription Options</Text>
					</Button>
				</View>

				<View style={styles.section}>
					<H1 className="text-center mb-2">Sign Out</H1>
					<Muted className="text-center mb-4">
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
				</View>
			</View>

			<Modal
				animationType="slide"
				transparent={false}
				visible={isPaywallVisible}
				onRequestClose={() => {
					setIsPaywallVisible(false);
				}}>
				<View style={styles.modalContainer}>
					{Platform.OS === 'ios' && (
						<View style={styles.modalHeader}>
							<Button variant="ghost" onPress={() => setIsPaywallVisible(false)}>
								<Text>Close</Text>
							</Button>
						</View>
					)}
					<PaywallComponent
						onPurchaseCompleted={handlePurchaseCompleted}
						onRestoreCompleted={handleRestoreCompleted}
						onPurchaseCancelled={handlePurchaseCancelled}
						onError={handleError}
					/>
					{Platform.OS === 'android' && (
						<View style={styles.modalFooter}>
							<Button variant="outline" onPress={() => setIsPaywallVisible(false)} className="mt-4">
								<Text>Close</Text>
							</Button>
						</View>
					)}
				</View>
			</Modal>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'bg-background', // This might not work directly, depends on how classNames are processed
	},
	contentContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingBottom: 20, // Added padding for scroll view content
	},
	section: {
		marginBottom: 24,
		width: '100%',
		alignItems: 'center', // Center section content like H1/Muted if not already
	},
	modalContainer: {
		flex: 1,
		paddingTop: Platform.OS === 'ios' ? 20 : 0, // Adjusted padding for status bar
	},
	modalHeader: {
		padding: 10,
		alignItems: 'flex-end',
		width: '100%',
	},
	modalFooter: {
		padding: 10,
		alignItems: 'center',
		width: '100%',
	},
});
