import { View } from "react-native";
import { Link } from "expo-router";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { useAuth } from "@/context/supabase-provider";

export default function Settings() {
	const { signOut } = useAuth();

	return (
		<View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
			<H1 className="text-center">Settings</H1>

			<Link href="/paywall-screen" asChild style={{ width: '100%' }}>
				<Button
					className="w-full"
					size="default"
					variant="outline" // Using outline to differentiate from Sign Out
				>
					<Text>View Paywall</Text>
				</Button>
			</Link>

			<Muted className="text-center pt-4">
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
	);
}
