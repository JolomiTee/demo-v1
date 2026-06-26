import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";

export async function getAuthenticatedUser(ctx: QueryCtx | MutationCtx) {
	const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Unauthorized");

		const user = await ctx.db.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
			.first();

	if (!user) throw new Error("User not found");

	return user
}

export const createUser = mutation({
	args: {
		username: v.string(),
		fullname: v.string(),
		image: v.string(),
		bio: v.optional(v.string()),
		email: v.string(),
		clerkId: v.string()
	},
	handler: async (ctx, args) => {

		const existingUser = await ctx.db.query("users").withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))

		if (!existingUser) return

		await ctx.db.insert("users", {
			username: args.username,
			fullname: args.fullname,
			email: args.email,
			bio: args.bio,
			image: args.image,
			followers: 0,
			following: 0,
			posts: 0,
			clerkId: args.clerkId
		} )
	}
})

export const getUserByClerkId = query({
	args: { clerkId: v.string() },
	handler: async (ctx, args) => {
		const user = await ctx.db.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId)).unique();

			return user
	}
})

export const updatesProfile = mutation({
	args: {
		fullname: v.string(),
		bio: v.optional(v.string())
	},
	handler: async (ctx, args) => {
		const currentUser = await getAuthenticatedUser(ctx);

		await ctx.db.patch(currentUser._id, {
			fullname: args.fullname,
			bio: args.bio
		})
	}
})

export const getUserProfile = query({
	args: { id: v.id("users") },
	handler: async (ctx, args) => {
		const user = await ctx.db.get(args.id)
		if (!user) throw new Error("User not found")

			return user
	}
})

export const isFollowing = query({
	args: { followingId: v.id("users") },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return [];

		const user = await ctx.db.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
			.first();


		if (!user) throw new Error("User not found")

			const follow = await ctx.db.query("follows").withIndex("by_both", (q) => q.eq("followerId", user._id).eq("followingId", args.followingId) ).first()

			return !!follow
	}
})

export const toggleFollow = mutation({
	args: { followingId: v.id("users") },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return [];

		const user = await getAuthenticatedUser(ctx)

		const existing = await ctx.db.query("follows").withIndex("by_both", (q) => q.eq("followerId", user._id).eq("followingId", args.followingId) ).first()

		if (existing) {
			// unfollow
			await ctx.db.delete(existing._id)
			await updateFollowCount(ctx, user._id, args.followingId, false)
		} else {
			await ctx.db.insert("follows", {
				followerId: user._id,
				followingId: args.followingId
			})
			await updateFollowCount(ctx, user._id, args.followingId, true)

			// create a notification
			await ctx.db.insert("notifications", {
				recieverId: args.followingId,
				senderId: user._id,
				type: "follow"
			})

		}
	}
})

async function updateFollowCount (
	ctx: MutationCtx,
	followerId: Id<"users">,
	followingId: Id<"users">,
	isFollow: boolean
) {
	const follower = await ctx.db.get(followerId)
	const following = await ctx.db.get(followingId)

	if (follower && following) {
		await ctx.db.patch(followerId, {
			following: follower.following + (isFollow ? 1 : -1),
		})

		await ctx.db.patch(followingId, {
			followers: following.followers + (isFollow ? 1 : -1)
		})
	}
}