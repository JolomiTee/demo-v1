import ClerkConvexProviders from "@/components/providers/Clerk_Convex_Providers";
import { Slot, usePathname } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
	const pathname = usePathname();

	console.log(pathname);
	return (
		<ClerkConvexProviders>
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
		</ClerkConvexProviders>
	);
}
