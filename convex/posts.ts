import { v } from "convex/values";
import { mutation } from "./_generated/server";

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
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Unauthorized");

		const user = await ctx.db.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
			.first();

		if (!user) throw new Error("User not found");

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