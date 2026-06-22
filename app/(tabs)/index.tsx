import { UserButton } from "@clerk/expo/native";
import { Text, View } from "react-native";

export default function Index() {
	return (
		<View>
			<Text>Your Personal Feeds</Text>
			<UserButton />
		</View>
	);
}
