import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/auth.styles";
import { useSSO } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";
import { type Href, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import { Image, Platform, Text, TouchableOpacity, View } from "react-native";

// Preloads the browser for Android devices to reduce authentication load time
// See: https://docs.expo.dev/guides/authentication/#improving-user-experience
export const useWarmUpBrowser = () => {
	React.useEffect(() => {
		if (Platform.OS !== "android") return;
		void WebBrowser.warmUpAsync();
		return () => {
			void WebBrowser.coolDownAsync();
		};
	}, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function login() {
	useWarmUpBrowser();

	const { startSSOFlow } = useSSO();
	const router = useRouter();
	const handleGoogleSignIn = async () => {
		// try {
		// 	const { createdSessionId, setActive } = await startSSOFlow({
		// 		strategy: "oauth_google",
		// 		redirectUrl: AuthSession.makeRedirectUri({
		// 			path: "/app",
		// 		}),
		// 	});

		// 	if (setActive && createdSessionId) {
		// 		console.log("Authenticated", createdSessionId);
		// 		setActive({ session: createdSessionId });
		// 		router.replace("/(tabs)");
		// 	}
		// } catch (error) {
		// 	console.log("OAuth Error", error);
		// }
		try {
			const { createdSessionId, setActive } = await startSSOFlow({
				strategy: "oauth_google",
				// For web, defaults to current path
				// For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
				// For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
				redirectUrl: AuthSession.makeRedirectUri({
					scheme: "clerkexpoquickstart",
					path: "exp://192.168.1.8:8081/(tabs)",
				}),
			});

			// If the session was created, set it as the active session
			if (createdSessionId) {
				setActive!({
					session: createdSessionId,
					navigate: async ({ session, decorateUrl }) => {
						// Handle session tasks
						// See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
						if (session?.currentTask) {
							console.log(session?.currentTask);
							return;
						}

						// If no session tasks, navigate the signed-in user to the home page
						const url = decorateUrl("/");
						if (url.startsWith("http")) {
							window.location.href = url;
						} else {
							router.push(url as Href);
						}
					},
				});
			} else {
				// If the session was not created, navigate to the continue page to collect missing information
				router.push("/(auth)/login");
			}
		} catch (err) {
			console.error(JSON.stringify(err, null, 2));
		}
	};
	return (
		<View style={styles.container}>
			{/* Brand Section */}
			<View style={styles.brandSection}>
				<View style={styles.logoContainer}>
					<Ionicons name="leaf" size={32} color={COLORS.primary} />
				</View>
				<Text style={styles.appName}>spotlight</Text>
				<Text style={styles.tagline}>don't miss anything</Text>
				<Image
					source={require("@/assets/images/auth-bg-2.png")}
					style={styles.illustration}
					resizeMode="contain"
				/>
			</View>

			{/* Login */}
			<View style={styles.loginSection}>
				<TouchableOpacity
					style={styles.googleButton}
					onPress={handleGoogleSignIn}
					activeOpacity={0.9}
				>
					<View style={styles.googleIconContainer}>
						<Ionicons
							name="logo-google"
							size={20}
							color={COLORS.surface}
						/>
					</View>
					<Text style={styles.googleButtonText}>Continue with Google</Text>
				</TouchableOpacity>

				<Text style={styles.termsText}>
					By continuing, you agree to our Terms and Privacy Policy
				</Text>
			</View>
		</View>
	);
}
