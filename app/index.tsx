import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Login from "./(auth)/login";

export default function MainScreen() {
	const { isSignedIn, isLoaded } = useAuth({
		treatPendingAsSignedOut: false,
	});

	const router = useRouter();

	useEffect(() => {
		if (isLoaded && isSignedIn) {
			router.replace("/(tabs)");
		}
	}, [isLoaded, isSignedIn, router]);

	if (!isLoaded) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	if (isSignedIn) {
		return null;
	}

	return <Login />;
}

const styles = StyleSheet.create({
	centered: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
