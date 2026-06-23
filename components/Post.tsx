import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/feed.styles";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type PostProps = {
	_creationTime: number;
	_id: Id<"posts">;
	author: {
		_id: Id<"users"> | undefined;
		username: string | undefined;
		image: string | undefined;
	};
	isLike: boolean;
	isBookmarked: boolean;
	caption?: string | undefined;
	comments: number;
	imageUrl: string;
	likes: number;
	storageId: Id<"_storage">;
	userId: Id<"users">;
};
export default function Post({ post }: { post: PostProps }) {
	const [isLiked, setIsLiked] = useState(post.isLike);
	const [likesCount, setLikesCount] = useState(post.likes);
	const toggleLike = useMutation(api.posts.toggleLike);

	const handleLike = async () => {
		try {
			const newIsLiked = await toggleLike({ postId: post._id });

			setLikesCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

			setIsLiked(!!newIsLiked);
		} catch (error) {
			console.log("Error toggling likes");
		}
	};
	return (
		<View style={styles.post}>
			<View style={styles.postHeader}>
				<Link href={"/"}>
					<TouchableOpacity style={styles.postHeaderLeft}>
						<Image
							source={post.author.image}
							style={styles.postAvatar}
							contentFit="cover"
							transition={200}
							cachePolicy={"memory-disk"}
						/>
						<Text style={styles.postUsername}>
							{post.author.username}
						</Text>
					</TouchableOpacity>
				</Link>

				{/* show a delete button */}
				{/* <TouchableOpacity>
					<Ionicons name="ellipsis-horizontal" size={20} color={COLORS.white}  />
				</TouchableOpacity> */}
				<TouchableOpacity>
					<Ionicons name="trash-outline" size={20} color={COLORS.white} />
				</TouchableOpacity>
			</View>

			{/* Image */}
			<Image
				source={post.imageUrl}
				style={styles.postImage}
				contentFit="cover"
				transition={200}
				cachePolicy={"memory-disk"}
			/>

			{/* Post Actions */}
			<View style={styles.postActions}>
				<View style={styles.postActionsLeft}>
					<TouchableOpacity onPress={handleLike}>
						<Ionicons
							name={isLiked ? "heart" : "heart-outline"}
							size={24}
							color={isLiked ? COLORS.primary : COLORS.white}
						/>
					</TouchableOpacity>
					<TouchableOpacity>
						<Ionicons
							name="chatbubble-outline"
							size={22}
							color={COLORS.white}
						/>
					</TouchableOpacity>
				</View>
				<TouchableOpacity>
					<Ionicons name="book-outline" size={22} color={COLORS.white} />
				</TouchableOpacity>
			</View>

			{/* Post Info */}
			<View style={styles.postInfo}>
				<Text style={styles.likesText}>
					{likesCount > 0
						? `${likesCount.toLocaleString()} like`
						: "Be the first to like this post"}
				</Text>
				{post.caption && (
					<View style={styles.captionContainer}>
						<Text style={styles.captionUsername}>
							{post.author.username}
						</Text>
						<Text style={styles.captionText}>{post.caption}</Text>
					</View>
				)}

				<TouchableOpacity>
					<Text style={styles.commentText}>View all 2 comments</Text>
				</TouchableOpacity>

				<Text style={styles.timeAgo}>2 hours ago</Text>
			</View>
		</View>
	);
}
