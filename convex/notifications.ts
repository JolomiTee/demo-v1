import { query } from "./_generated/server";

export const getNotifications = query({
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return [];

		const currentUser = await ctx.db.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
			.first();

		if (!currentUser) return [];

		const notifications = await ctx.db.query("notifications").withIndex("by_reciever", (q) => q.eq("recieverId", currentUser._id)).order("desc").collect()


		const formattedNotifications = await Promise.all(
			notifications.map(async (notification) => {
				const sender = (await ctx.db.get(notification.senderId))!

				let post = null
				let comment = null

				if (notification.postId) {
					post = await ctx.db.get(notification.postId)
				}

				if (notification.type === "comment" && notification.commentId) {
					comment = await ctx.db.get(notification.commentId)
				}

				const imageUrl = post && await ctx.storage.getUrl(post.storageId);

				// const senderImageUrl = post && await ctx.storage.getUrl(sender.image);


				return {
					...notification,
					sender: {
						_id: sender._id,
						username: sender.username,
						image: sender.image
					},
					comment: comment?.content,
					post: {
						...post,
						imageUrl
					}
				}
			})
		)

		return formattedNotifications
	}
})