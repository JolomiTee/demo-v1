import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const generatedUploadUrl = mutation(async (ctx) => {
	const identity = await ctx.auth.getUserIdentity();
	if (!identity) throw new Error("Unauthorized")
		return await ctx.storage.generateUploadUrl()
})

export const createPost = mutation({
	args: {
		caption: v.optional(v.string()),
		storageId: v.id("_storage")
	},

	handler: async (ctx, args) => {
		const user = await getAuthenticatedUser(ctx)

		const imageUrl = await ctx.storage.generateUploadUrl();

		if (!imageUrl) throw new Error("Image not found");

		// create Post
		const postId = await ctx.db.insert("posts", {
			userId: user._id,
			imageUrl,
			storageId: args.storageId,
			caption: args.caption,
			likes: 0,
			comments: 0
		})

		// increment thr number of posts by 1
		await ctx.db.patch(user._id, {
			posts: user.posts + 1
		})

		return {
			message: "New post created!",
			postId
		}
	}
})

export const getFeedPosts = query({
	handler: async (ctx) => {
		const user = await getAuthenticatedUser(ctx)

		// get all posts
		const posts = await ctx.db.query("posts").order("desc").collect()

		if (posts.length === 0) return []

		const formattedPosts = await Promise.all(
			posts.map(async (post) => {
				const postAuthor = await ctx.db.get(post.userId)

				const like = await ctx.db.query("likes")
					.withIndex("by_user_and_post", (q) => q.eq("userId", user._id).eq("postId", post._id)).first()

				const bookmark = await ctx.db.query("bookmarks")
				.withIndex("by_user_and_post", (q) => q.eq("userId", user._id).eq("postId", post._id)).first()

				return {
					...post,
					author: {
						_id: postAuthor?._id,
						username: postAuthor?.username,
						image: postAuthor?.image
					},
					isLike: !!like,
					isBookmarked: !!bookmark
				}
			})
		)

		return formattedPosts

	}
})