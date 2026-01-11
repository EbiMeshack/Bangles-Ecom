import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { authComponent } from "./auth";

async function requireAdmin(ctx: any) {
    const authUser = await authComponent.getAuthUser(ctx);

    if (!authUser) {
        throw new Error("Authentication required");
    }

    const profile = await ctx.db
        .query("userProfiles")
        .withIndex("by_userId", (q: any) => q.eq("userId", authUser.userId ?? authUser._id))
        .first();

    if (!profile || profile.role !== "admin") {
        throw new Error("Admin access required");
    }

    return { authUser, profile };
}

function calculateDiscount(coupon: any, amount: number): number {
    let discount = 0;

    if (coupon.discountType === "percentage") {
        discount = (amount * coupon.discountValue) / 100;
        if (coupon.maximumDiscountAmount) {
            discount = Math.min(discount, coupon.maximumDiscountAmount);
        }
    } else {
        discount = Math.min(coupon.discountValue, amount);
    }

    return Math.round(discount * 100) / 100;
}

export const list = query({
    args: {
        isActive: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);

        let coupons;

        if (args.isActive !== undefined) {
            coupons = await ctx.db
                .query("coupons")
                .withIndex("by_isActive", (q) => q.eq("isActive", args.isActive!))
                .order("desc")
                .collect();
        } else {
            coupons = await ctx.db
                .query("coupons")
                .order("desc")
                .collect();
        }

        const couponsWithStats = await Promise.all(
            coupons.map(async (coupon) => {
                const usages = await ctx.db
                    .query("couponUsages")
                    .withIndex("by_couponId", (q) => q.eq("couponId", coupon._id))
                    .collect();

                const totalDiscount = usages.reduce((sum, u) => sum + u.discountApplied, 0);
                const uniqueUsers = new Set(usages.map(u => u.userId)).size;

                return {
                    ...coupon,
                    stats: {
                        totalUsages: usages.length,
                        uniqueUsers,
                        totalDiscount: Math.round(totalDiscount * 100) / 100,
                    },
                };
            })
        );

        return couponsWithStats;
    },
});

export const get = query({
    args: { id: v.id("coupons") },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);

        const coupon = await ctx.db.get(args.id);

        if (!coupon) {
            throw new Error("Coupon not found");
        }

        const usages = await ctx.db
            .query("couponUsages")
            .withIndex("by_couponId", (q) => q.eq("couponId", coupon._id))
            .collect();

        const totalDiscount = usages.reduce((sum, u) => sum + u.discountApplied, 0);
        const uniqueUsers = new Set(usages.map(u => u.userId)).size;

        return {
            ...coupon,
            stats: {
                totalUsages: usages.length,
                uniqueUsers,
                totalDiscount: Math.round(totalDiscount * 100) / 100,
                recentUsages: usages.slice(0, 10).map(u => ({
                    userId: u.userId,
                    discountApplied: u.discountApplied,
                    usedAt: u.usedAt,
                })),
            },
        };
    },
});

export const getByCode = query({
    args: { code: v.string() },
    handler: async (ctx, args) => {
        const coupon = await ctx.db
            .query("coupons")
            .withIndex("by_code", (q) => q.eq("code", args.code.toUpperCase()))
            .first();

        return coupon;
    },
});

export const validateCoupon = query({
    args: {
        code: v.string(),
        userId: v.string(),
        cartItems: v.array(v.object({
            productId: v.id("products"),
            quantity: v.number(),
            price: v.number(),
            category: v.string(),
        })),
    },
    handler: async (ctx, { code, userId, cartItems }) => {
        const now = Date.now();

        const coupon = await ctx.db
            .query("coupons")
            .withIndex("by_code", (q) => q.eq("code", code.toUpperCase()))
            .first();

        if (!coupon) {
            return { valid: false, error: "Coupon code not found" };
        }

        if (!coupon.isActive) {
            return { valid: false, error: "This coupon is no longer active" };
        }

        if (now < coupon.startDate) {
            return { valid: false, error: "This coupon is not yet active" };
        }
        if (now > coupon.expiryDate) {
            return { valid: false, error: "This coupon has expired" };
        }

        if (coupon.maxUsageCount && coupon.currentUsageCount >= coupon.maxUsageCount) {
            return { valid: false, error: "This coupon has reached its usage limit" };
        }

        if (coupon.maxUsagePerUser) {
            const userUsages = await ctx.db
                .query("couponUsages")
                .withIndex("by_coupon_and_user", (q) =>
                    q.eq("couponId", coupon._id).eq("userId", userId)
                )
                .collect();

            if (userUsages.length >= coupon.maxUsagePerUser) {
                return {
                    valid: false,
                    error: "You've already used this coupon the maximum number of times"
                };
            }
        }

        const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        if (coupon.minimumPurchaseAmount && cartTotal < coupon.minimumPurchaseAmount) {
            return {
                valid: false,
                error: `Minimum purchase of ₹${coupon.minimumPurchaseAmount} required`,
            };
        }

        let discount = 0;

        if (coupon.applicationType === "all") {
            discount = calculateDiscount(coupon, cartTotal);
        } else if (coupon.applicationType === "category") {
            const eligibleTotal = cartItems
                .filter(item => coupon.categoryIds?.includes(item.category))
                .reduce((sum, item) => sum + (item.price * item.quantity), 0);
            discount = calculateDiscount(coupon, eligibleTotal);
        } else if (coupon.applicationType === "product") {
            const eligibleTotal = cartItems
                .filter(item => coupon.productIds?.includes(item.productId))
                .reduce((sum, item) => sum + (item.price * item.quantity), 0);
            discount = calculateDiscount(coupon, eligibleTotal);
        }

        if (discount === 0) {
            return { valid: false, error: "No eligible items in cart for this coupon" };
        }

        return {
            valid: true,
            couponId: coupon._id,
            discount,
            description: coupon.description,
        };
    },
});

export const create = mutation({
    args: {
        code: v.string(),
        description: v.string(),
        discountType: v.union(v.literal("percentage"), v.literal("flat")),
        discountValue: v.number(),
        applicationType: v.union(
            v.literal("all"),
            v.literal("category"),
            v.literal("product")
        ),
        categoryIds: v.optional(v.array(v.string())),
        productIds: v.optional(v.array(v.id("products"))),
        minimumPurchaseAmount: v.optional(v.number()),
        maximumDiscountAmount: v.optional(v.number()),
        maxUsageCount: v.optional(v.number()),
        maxUsagePerUser: v.optional(v.number()),
        startDate: v.number(),
        expiryDate: v.number(),
        isActive: v.boolean(),
    },
    handler: async (ctx, args) => {
        const { profile } = await requireAdmin(ctx);

        const existingCoupon = await ctx.db
            .query("coupons")
            .withIndex("by_code", (q) => q.eq("code", args.code.toUpperCase()))
            .first();

        if (existingCoupon) {
            throw new Error("Coupon code already exists");
        }

        if (args.startDate >= args.expiryDate) {
            throw new Error("Expiry date must be after start date");
        }

        if (args.discountType === "percentage" && (args.discountValue <= 0 || args.discountValue > 100)) {
            throw new Error("Percentage discount must be between 0 and 100");
        }

        if (args.discountType === "flat" && args.discountValue <= 0) {
            throw new Error("Flat discount must be greater than 0");
        }

        const now = Date.now();

        const couponId = await ctx.db.insert("coupons", {
            code: args.code.toUpperCase(),
            description: args.description,
            discountType: args.discountType,
            discountValue: args.discountValue,
            applicationType: args.applicationType,
            categoryIds: args.categoryIds,
            productIds: args.productIds,
            minimumPurchaseAmount: args.minimumPurchaseAmount,
            maximumDiscountAmount: args.maximumDiscountAmount,
            maxUsageCount: args.maxUsageCount,
            currentUsageCount: 0,
            maxUsagePerUser: args.maxUsagePerUser,
            startDate: args.startDate,
            expiryDate: args.expiryDate,
            isActive: args.isActive,
            createdBy: profile.userId,
            createdAt: now,
            updatedAt: now,
        });

        return couponId;
    },
});

export const update = mutation({
    args: {
        id: v.id("coupons"),
        code: v.optional(v.string()),
        description: v.optional(v.string()),
        discountType: v.optional(v.union(v.literal("percentage"), v.literal("flat"))),
        discountValue: v.optional(v.number()),
        applicationType: v.optional(v.union(
            v.literal("all"),
            v.literal("category"),
            v.literal("product")
        )),
        categoryIds: v.optional(v.array(v.string())),
        productIds: v.optional(v.array(v.id("products"))),
        minimumPurchaseAmount: v.optional(v.number()),
        maximumDiscountAmount: v.optional(v.number()),
        maxUsageCount: v.optional(v.number()),
        maxUsagePerUser: v.optional(v.number()),
        startDate: v.optional(v.number()),
        expiryDate: v.optional(v.number()),
        isActive: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);

        const coupon = await ctx.db.get(args.id);

        if (!coupon) {
            throw new Error("Coupon not found");
        }

        if (args.code && args.code.toUpperCase() !== coupon.code) {
            const newCode = args.code;
            const existingCoupon = await ctx.db
                .query("coupons")
                .withIndex("by_code", (q) => q.eq("code", newCode.toUpperCase()))
                .first();

            if (existingCoupon) {
                throw new Error("Coupon code already exists");
            }
        }

        const updates: any = {
            updatedAt: Date.now(),
        };

        if (args.code) updates.code = args.code.toUpperCase();
        if (args.description) updates.description = args.description;
        if (args.discountType) updates.discountType = args.discountType;
        if (args.discountValue !== undefined) updates.discountValue = args.discountValue;
        if (args.applicationType) updates.applicationType = args.applicationType;
        if (args.categoryIds !== undefined) updates.categoryIds = args.categoryIds;
        if (args.productIds !== undefined) updates.productIds = args.productIds;
        if (args.minimumPurchaseAmount !== undefined) updates.minimumPurchaseAmount = args.minimumPurchaseAmount;
        if (args.maximumDiscountAmount !== undefined) updates.maximumDiscountAmount = args.maximumDiscountAmount;
        if (args.maxUsageCount !== undefined) updates.maxUsageCount = args.maxUsageCount;
        if (args.maxUsagePerUser !== undefined) updates.maxUsagePerUser = args.maxUsagePerUser;
        if (args.startDate) updates.startDate = args.startDate;
        if (args.expiryDate) updates.expiryDate = args.expiryDate;
        if (args.isActive !== undefined) updates.isActive = args.isActive;

        await ctx.db.patch(args.id, updates);

        return args.id;
    },
});

export const remove = mutation({
    args: { id: v.id("coupons") },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);

        const coupon = await ctx.db.get(args.id);

        if (!coupon) {
            throw new Error("Coupon not found");
        }

        const usages = await ctx.db
            .query("couponUsages")
            .withIndex("by_couponId", (q) => q.eq("couponId", args.id))
            .collect();

        for (const usage of usages) {
            await ctx.db.delete(usage._id);
        }

        await ctx.db.delete(args.id);

        return { success: true };
    },
});

export const applyCoupon = mutation({
    args: {
        couponId: v.id("coupons"),
        userId: v.string(),
        discountApplied: v.number(),
        orderId: v.optional(v.string()),
    },
    handler: async (ctx, { couponId, userId, discountApplied, orderId }) => {
        await markCouponUsed(ctx, { couponId, userId, discountApplied, orderId });

        return { success: true };
    },
});

export const markCouponUsed = async (
    ctx: any,
    args: {
        couponId: string;
        userId: string;
        discountApplied: number;
        orderId?: string;
    }
) => {
    await ctx.db.insert("couponUsages", {
        couponId: args.couponId,
        userId: args.userId,
        orderId: args.orderId,
        discountApplied: args.discountApplied,
        usedAt: Date.now(),
    });

    const coupon = await ctx.db.get(args.couponId);
    if (coupon) {
        await ctx.db.patch(args.couponId, {
            currentUsageCount: coupon.currentUsageCount + 1,
            updatedAt: Date.now(),
        });
    }
};
