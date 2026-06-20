import { Stack } from "expo-router";

export default function InitialLayout() {
	// const { isLoaded, isSignedIn } = useAuth();

	// const segments = useSegments();
	// const router = useRouter();

	// useEffect(() => {
	// 	if (!isLoaded) return;

	// 	const inAuthPage = segments[0] === "(auth)";

	// 	if (!isSignedIn && !inAuthPage) {
	// 		router.replace("/(auth)/login");
	// 	} else if (isSignedIn && inAuthPage) {
	// 		router.replace("/(tabs)");
	// 	}
	// }, [isLoaded, isSignedIn, segments]);

	// if (!isLoaded) return <ActivityIndicator />;

	return <Stack screenOptions={{ headerShown: false }} />;
}
