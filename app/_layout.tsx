import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
	return (
		<SafeAreaProvider>
			<SafeAreaProvider
				style={{
					flex: 1,
				}}
			>
				<Stack>
					<Stack.Screen name="index" options={{ title: "Feed" }} />
					<Stack.Screen
						name="notifications"
						options={{
							title: "notifications",
							headerShown: false,
						}}
					/>
				</Stack>
			</SafeAreaProvider>
		</SafeAreaProvider>
	);
}
