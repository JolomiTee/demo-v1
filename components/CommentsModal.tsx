import Comments from "@/components/Comments";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/feed.styles";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Loader from "./Loader";

type ICommentModal = {
	postId: Id<"posts">;
	visible: boolean;
	onClose: () => void;
};

export default function CommentsModal({
	postId,
	visible,
	onClose,
}: ICommentModal) {
	const [newComment, setnewComment] = useState("");
	const comments = useQuery(api.comments.getComments, { postId });
	const addComment = useMutation(api.comments.addComment);

	const handleAddComment = async () => {
		if (!newComment.trim()) return;

		try {
			await addComment({
				content: newComment,
				postId,
			});

			setnewComment("");
		} catch (error) {
			console.log("Error adding this comment", error);
		}
	};

	return (
		<Modal
			visible={visible}
			animationType="slide"
			transparent
			onRequestClose={onClose}
			style={{ maxHeight: "70%" }}
		>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				// behavior="padding"
				style={styles.modalContainer}
			>
				<View style={styles.modalHeader}>
					<TouchableOpacity onPress={onClose}>
						<Ionicons name="close" size={24} color={COLORS.white} />
					</TouchableOpacity>

					<Text style={styles.modalTitle}>Comments</Text>
					<View style={{ width: 24 }} />
				</View>

				{comments === undefined ? (
					<Loader />
				) : (
					<FlatList
						data={comments}
						keyExtractor={(item) => item._id}
						renderItem={({ item }) => <Comments comment={item} />}
						contentContainerStyle={styles.commentsList}
					/>
				)}

				<View style={styles.commentInput}>
					<TextInput
						style={styles.input}
						placeholder="Add a comment..."
						placeholderTextColor={COLORS.grey}
						value={newComment}
						onChangeText={setnewComment}
						multiline
					/>
					<TouchableOpacity
						onPress={handleAddComment}
						disabled={!newComment.trim()}
					>
						<Text
							style={[
								styles.postButton,
								!newComment.trim() && styles.postButtonDisabled,
							]}
						>
							Post
						</Text>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	);
}
