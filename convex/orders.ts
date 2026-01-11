import { query, mutation, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";
import { markCouponUsed } from "./coupons";

async function checkAdmin(ctx: QueryCtx | MutationCtx) {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
        throw new Error("Unauthorized");
    }

    const profile = await ctx.db
        .query("userProfiles")
        .withIndex("by_userId", (q) => q.eq("userId", authUser.userId ?? authUser._id))
        .first();

    if (!profile || profile.role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
    }

    return { authUser, profile };
}



export const create = mutation({
    args: {
        userId: v.string(),
        items: v.array(v.object({
            productId: v.id("products"),
            quantity: v.number(),
            price: v.number(),
            name: v.string(),
            image: v.optional(v.string())
        })),
        shippingAddress: v.object({
            street: v.string(),
            city: v.string(),
            state: v.string(),
            zip: v.string(),
            country: v.string(),
        }),
        amount: v.number(),
        couponId: v.optional(v.id("coupons")),
        discountValue: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const orderId = await ctx.db.insert("orders", {
            orderNumber,
            userId: args.userId,
            items: args.items,
            shippingAddress: args.shippingAddress,
            amount: args.amount,
            status: "pending",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        if (args.couponId && args.discountValue) {
            await markCouponUsed(ctx, {
                couponId: args.couponId,
                userId: args.userId,
                discountApplied: args.discountValue,
                orderId: orderId,
            });
        }

        return { orderId, orderNumber };
    },
});

export const markAsPaid = mutation({
    args: {
        orderId: v.id("orders"),
        paymentId: v.string(),
        signature: v.string(),
        razorpayOrderId: v.string(),
    },
    handler: async (ctx, args) => {


        await ctx.db.patch(args.orderId, {
            status: "completed",
            updatedAt: Date.now(),
        });
    },
});

export const getUserOrders = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const orders = await ctx.db
            .query("orders")
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .collect();

        return orders.sort((a, b) => b.createdAt - a.createdAt);
    },
});

export const getAllOrders = query({
    args: {},
    handler: async (ctx) => {
        await checkAdmin(ctx);
        const orders = await ctx.db.query("orders").collect();
        return orders.sort((a, b) => b.createdAt - a.createdAt);
    },
});

export const updateOrderStatus = mutation({
    args: {
        orderId: v.id("orders"),
        status: v.union(
            v.literal("pending"),
            v.literal("completed"),
            v.literal("cancelled"),
            v.literal("refunded")
        ),
    },
    handler: async (ctx, args) => {
        await checkAdmin(ctx);
        await ctx.db.patch(args.orderId, {
            status: args.status,
            updatedAt: Date.now(),
        });
    },
});

export const deleteOrder = mutation({
    args: {
        orderId: v.id("orders"),
    },
    handler: async (ctx, args) => {
        await checkAdmin(ctx);
        await ctx.db.delete(args.orderId);
    },
});
