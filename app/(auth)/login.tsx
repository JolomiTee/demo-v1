import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/auth.styles";
import { useSSO } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
// import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import { Image, Platform, Text, TouchableOpacity, View } from "react-native";

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

// console.log(
// 	AuthSession.makeRedirectUri({
// 		path: "(auth)/login",
// 	}),
// );

export default function Login() {
	useWarmUpBrowser();

	const { startSSOFlow } = useSSO();
	const router = useRouter();
	const handleGoogleSignIn = async () => {
		try {
			console.log("Logging in");
			const { createdSessionId, setActive, authSessionResult } =
				await startSSOFlow({
					strategy: "oauth_google",
					// redirectUrl: AuthSession.makeRedirectUri({
					// 	path: "/(auth)/login",
					// }),
				});

			console.log("i got here");
			console.log({ createdSessionId, authSessionResult });

			if (createdSessionId) {
				await setActive!({ session: createdSessionId });
				router.replace("/(tabs)");
			} else {
				console.log(
					"SSO flow did not produce a session — check missing requirements",
				);
			}
		} catch (err) {
			console.error("OAuth Error:", JSON.stringify(err, null, 2));
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
