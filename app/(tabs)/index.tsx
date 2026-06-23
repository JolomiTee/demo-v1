import Loader from "@/components/Loader";
import Post from "@/components/Post";
import Story from "@/components/Story";
import { STORIES } from "@/constants/mock-data";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/feed.styles";
import { useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
	const { signOut } = useAuth();

	const posts = useQuery(api.posts.getFeedPosts);

	if (posts === undefined) return <Loader />;

	if (posts.length === 0) return <NoPostFound />;

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>spotlight</Text>
				<TouchableOpacity onPress={() => signOut()}>
					<Ionicons
						name="log-out-outline"
						size={24}
						color={COLORS.white}
					/>
				</TouchableOpacity>
			</View>

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 60 }}
			>
				<ScrollView
					showsVerticalScrollIndicator={false}
					style={styles.storiesContainer}
					horizontal
				>
					{STORIES.map((story) => (
						<Story story={story} key={story.id} />
					))}
				</ScrollView>

				{posts.map((post) => (
					<Post key={post._id} post={post} />
				))}
			</ScrollView>
		</View>
	);
}

const NoPostFound = () => {
	return (
		<View
			style={{
				flex: 1,
				backgroundColor: COLORS.background,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Text style={{ fontSize: 20, color: COLORS.primary }}>
				No POst Found
			</Text>
		</View>
	);
};
