import { indexStyles } from "@/styles/index.styles";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
	return (
		<View style={indexStyles.container}>
			<Text style={indexStyles.title}>Taiwo's First Mobile App</Text>
			<TouchableOpacity onPress={() => alert("Taiwo will be a Mobile Dev")}>
				<Text>Continue</Text>
			</TouchableOpacity>

			<Pressable
				android_ripple={{ color: "#ccc" }}
				onPress={() => alert("Taiwo will not be a Mobile Dev")}
			>
				<Text>Go Back</Text>
			</Pressable>

			<Image
				// source={require("@/assets/images/icon.png")}
				source={{
					uri: "https://images.unsplash.com/photo-1780995173654-fd42bcb501cd?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
				}}
				style={{
					width: 200,
					height: 200,
					borderRadius: 10,
				}}
			/>
		</View>
	);
}
