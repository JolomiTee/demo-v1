import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";


export const toggleBookmark = mutation({
	args: {postId: v.id("posts")},

	handler: async (ctx, args) => {
		const user = await getAuthenticatedUser(ctx)

		const existing = await ctx.db.query("bookmarks").withIndex("by_user_and_post", (q) => q.eq("userId", user._id).eq("postId", args.postId)).first()

		if (existing) {
			await ctx.db.delete(existing._id);
			return false
		} else {
			await ctx.db.insert("bookmarks", {userId: user._id, postId: args.postId})
			return true
		}
	}
})

export const getBookmarkedPosts = query({
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return [];

		const user = await ctx.db.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
			.first();

		if (!user) return [];

		const bookmarks = await ctx.db.query("bookmarks").withIndex("by_user", (q) => q.eq("userId", user._id)).order("desc").collect()

		const bookmarkWithInfo = await Promise.all(
			bookmarks.map(async (bookmarks) => {
				const post = await ctx.db.get(bookmarks.postId)
				const imageUrl = post && await ctx.storage.getUrl(post.storageId);
				return {...post, imageUrl};
			})
		)

		return bookmarkWithInfo
	}
})