import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addReview = mutation({
    args: {
        productId: v.id("products"),
        userId: v.string(),
        rating: v.number(),
        comment: v.string(),
    },
    handler: async (ctx, args) => {
        const reviewId = await ctx.db.insert("reviews", {
            productId: args.productId,
            userId: args.userId,
            rating: args.rating,
            comment: args.comment,
            createdAt: Date.now(),
        });
        return reviewId;
    },
});

export const getReviewsByProductId = query({
    args: {
        productId: v.id("products"),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("reviews")
            .withIndex("by_productId", (q) => q.eq("productId", args.productId))
            .collect();
    },
});
