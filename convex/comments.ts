import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";


export const addComment = mutation({
	args: {
		content: v.string(),
		postId: v.id("posts")
	},

	handler: async (ctx, args) => {
		const user = await getAuthenticatedUser(ctx);

		const post = await ctx.db.get(args.postId);

		if (!post) throw new Error("Post not Found");

		const commentId = await ctx.db.insert("comments", {
			userId: user._id,
			postId: args.postId,
			content: args.content
		});

		await ctx.db.patch(args.postId, { comments: post.comments + 1 })

		if (post.userId !== user._id) {
			await ctx.db.insert("notifications", {
				recieverId: post.userId,
				senderId: user._id,
				type: "comment",
				postId: args.postId,
				commentId
			});
		}

		return commentId;
	}
})

export const getComments = query({
	args: {
		postId: v.id("posts")
	},

	handler: async (ctx, args) => {
		const comment = await ctx.db.query("comments").withIndex("by_post", q => q.eq("postId", args.postId)).collect()


		const formattedComments = await Promise.all(
			comment.map(async (comment) => {
				const user = await ctx.db.get(comment.userId)

				return {
					...comment,
					user: {
						fullname: user?.fullname,
						image: user?.image
					}
				}
			})
		)
		return formattedComments;
	}
})