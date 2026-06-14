import { indexStyles } from "@/styles/index.styles";
import { Link } from "expo-router";
import { View } from "react-native";

export default function Index() {
	return (
		<View style={indexStyles.container}>
			<Link href={"/notifications"}>My Notifications</Link>
		</View>
	);
}
