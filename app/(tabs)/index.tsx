import { Link } from "expo-router";
import { View } from "react-native";

export default function Index() {
	return (
		<View>
			<Link style={{ margin: 10 }} href={"/notifications"}>
				Your Personal Feeds
			</Link>
		</View>
	);
}
