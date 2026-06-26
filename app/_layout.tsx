import ClerkConvexProviders from "@/components/providers/Clerk_Convex_Providers";
import { useFonts } from "expo-font";
import { NavigationBar } from "expo-navigation-bar";
import { Slot, SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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
				<NavigationBar style="light" />
				<StatusBar style="light" />
			</SafeAreaProvider>
		</ClerkConvexProviders>
	);
}
