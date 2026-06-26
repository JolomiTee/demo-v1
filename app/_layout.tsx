import ClerkConvexProviders from "@/components/providers/Clerk_Convex_Providers";
import { useFonts } from "expo-font";
import { Slot, SplashScreen, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const pathname = usePathname();
	const [fontsLoaded] = useFonts({
		"JetBrainsMono-Medium": require("@/assets/fonts/JetBrainsMono-Medium.ttf"),
	});

	const onLayoutRootView = useCallback(async () => {
		if (fontsLoaded) SplashScreen.hideAsync();
	}, [fontsLoaded]);

	return (
		<ClerkConvexProviders>
			<SafeAreaProvider>
				<SafeAreaView
					style={{
						flex: 1,
						backgroundColor: "black",
					}}
					onLayout={onLayoutRootView}
				>
					<Slot />
				</SafeAreaView>
				<StatusBar style="light" />
			</SafeAreaProvider>
		</ClerkConvexProviders>
	);
}
