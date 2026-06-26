import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const generatedUploadUrl = mutation(async (ctx) => {
	const user = await getAuthenticatedUser(ctx)

	if (!user) throw new Error("Unauthorized")
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

/**
 * `getFeedPosts` is a query (not a mutation), so Convex runs it reactively. When your app mounts, `useQuery(api.posts.getFeedPosts)` subscribes immediately — but the Clerk auth token hasn't been synced to Convex yet. So `ctx.auth.getUserIdentity()` returns null, and `getAuthenticatedUser` throws "Unauthorized".

What the fix does
Instead of calling getAuthenticatedUser (which throws), the query should do this:

	1. Check getUserIdentity() directly
	2. Returns [] if there's no auth yet (graceful fallback)
	3. Returns [] if the user record isn't found
	4. Otherwise proceeds normally
The query will automatically re-run once the auth token is ready, at which point it'll return the real data. This is the standard Convex pattern for queries that need auth.

_Note_: The getAuthenticatedUser helper is fine for mutations (which are one-shot calls that only fire when the user explicitly acts), but queries need to handle the unauthenticated state gracefully since they run reactively.
 */

export const getFeedPosts = query({
	handler: async (ctx) => {


		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return [];

		const user = await ctx.db.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
			.first();

		if (!user) return [];

		// get all posts
		const posts = await ctx.db.query("posts").order("desc").collect()

		if (posts.length === 0) return []

		const formattedPosts = await Promise.all(
			posts.map(async (post) => {
				const postAuthor = await ctx.db.get(post.userId)

				const imageUrl = await ctx.storage.getUrl(post.storageId);

				const like = await ctx.db.query("likes")
					.withIndex("by_user_and_post", (q) => q.eq("userId", user._id).eq("postId", post._id)).first()

				const bookmark = await ctx.db.query("bookmarks")
				.withIndex("by_user_and_post", (q) => q.eq("userId", user._id).eq("postId", post._id)).first()

				return {
					...post,
					imageUrl,
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

export const toggleLike = mutation({
	args: {
		postId: v.id("posts")
	},

	handler: async (ctx, args) => {
		const user = await getAuthenticatedUser(ctx);

		const existing = await ctx.db.query("likes").withIndex("by_user_and_post", (q) => q.eq("userId", user._id).eq("postId", args.postId)).first();

		const post = await ctx.db.get(args.postId);

		if (!post) throw new Error("Post not found");

		if (existing) {
			await ctx.db.delete(existing._id);
			await ctx.db.patch(args.postId, { likes: post.likes - 1 });
		} else {
			await ctx.db.insert("likes", {
				userId: user._id,
				postId: args.postId
			});
			await ctx.db.patch(args.postId, { likes: post.likes + 1 });

			if (user._id !== post.userId) {
				await ctx.db.insert("notifications", {
					recieverId: post.userId,
					senderId: user._id,
					type: "like",
					postId: args.postId
				})
			};;

			return true
		}
	}
})

export const deletePost = mutation({
	args: { postId: v.id("posts") },
	handler: async (ctx, args) => {

		const user = await getAuthenticatedUser(ctx);

		const post = await ctx.db.get(args.postId)

		if (!post) throw new Error("Post not found")

		if (post.userId !== user._id) throw new Error("Not authorized to delete this post")

		const likes = await ctx.db
			.query("likes")
			.withIndex('by_post', (q) => q.eq("postId", args.postId))
			.collect()

		for (const like of likes) {
			await ctx.db.delete(like._id)
		}

		const comments = await ctx.db
			.query("comments")
			.withIndex("by_post", (q) => q.eq("postId", args.postId))
			.collect()

		for (const comment of comments) {
			await ctx.db.delete(comment._id)
		}

		const notifications = await ctx.db.query("notifications").withIndex("by_post", (q) => q.eq("postId", args.postId)).collect()

		for (const notification of notifications) {
			await ctx.db.delete(notification._id)
		}

		await ctx.storage.delete(post.storageId)

		await ctx.db.delete(args.postId)

		await ctx.db.patch(user._id, {
			posts: Math.max(0, (user.posts || 1) - 1)
		})

	}
})

export const getPostsByUser = query({
	args: { userId: v.optional(v.id("users")) },
	handler: async (ctx, args) => {

		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return [];

		const user = args.userId ? await ctx.db.get(args.userId) : await ctx.db.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
			.first();


		if (!user) throw new Error("User not found")

		const posts = await ctx.db.query("posts").withIndex("by_user", (q) => q.eq("userId", args.userId || user._id)).collect()

		const formattedPosts = await Promise.all(
			posts.map(async (post) => {

				const imageUrl = await ctx.storage.getUrl(post.storageId);

				return {
					...post,
					imageUrl,
				}
			})
		)

		return formattedPosts
	}
})