import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Slot, usePathname } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
	throw new Error("Add your Clerk Publishable Key to the .env file");
}

export default function RootLayout() {
	const pathname = usePathname();

	console.log(pathname);
	return (
		<ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
			<SafeAreaProvider>
				<SafeAreaView
					style={{
						flex: 1,
						backgroundColor: "black",
					}}
				>
					<Slot />
				</SafeAreaView>
			</SafeAreaProvider>
		</ClerkProvider>
	);
}
