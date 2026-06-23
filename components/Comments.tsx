import { Id } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/feed.styles";
import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";
import { Text, View } from "react-native";

interface Comment {
	_creationTime: number;
	_id: Id<"comments">;
	user: {
		fullname: string | undefined;
		image: string | undefined;
	};
	content: string;
	postId: Id<"posts">;
	userId: Id<"users">;
}
export default function Comments({ comment }: { comment: Comment }) {
	return (
		<View style={styles.commentContainer}>
			<Image
				source={{ uri: comment.user.image }}
				style={styles.commentAvatar}
			/>
			<View style={styles.commentContent}>
				<Text style={styles.commentUsername}>{comment.user.fullname}</Text>
				<Text style={styles.commentText}>{comment.content}</Text>
				<Text style={styles.commentTime}>
					{formatDistanceToNow(comment._creationTime, { addSuffix: true })}
				</Text>
			</View>
		</View>
	);
}
