import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/auth.styles";
import { AuthView } from "@clerk/expo/native";
import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";

export default function Login() {
	const [isAuthOpen, setIsAuthOpen] = React.useState(false);
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
					onPress={() => setIsAuthOpen(true)}
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

			<Modal
				animationType="slide"
				visible={isAuthOpen}
				presentationStyle="pageSheet"
				onRequestClose={() => setIsAuthOpen(false)}
			>
				<AuthView onDismiss={() => setIsAuthOpen(false)} />
			</Modal>
		</View>
	);
}
