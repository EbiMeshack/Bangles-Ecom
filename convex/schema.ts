import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // User profiles table to store additional user information
    userProfiles: defineTable({
        // Reference to the auth user ID from Better Auth
        userId: v.string(),
        // User's email address
        email: v.string(),
        // User's phone number
        phoneNumber: v.string(),
        // User's role (e.g., "user", "admin", "vendor")
        role: v.string(),
        // Optional: User's full name (if you want to store it here too)
        name: v.optional(v.string()),
        // Timestamps for tracking
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        // Index by userId for fast lookups
        .index("by_userId", ["userId"])
        // Index by role for querying users by role
        .index("by_role", ["role"]),

    // Products table
    products: defineTable({
        name: v.string(),
        price: v.number(),
        category: v.string(),
        image: v.string(),
        quantity: v.number(),
        // Note: rating and reviews are calculated dynamically from the reviews table
    }).index("by_category", ["category"]),

    // Reviews table for dynamic ratings and reviews
    reviews: defineTable({
        productId: v.id("products"),
        userId: v.string(), // Reference to userProfiles or better-auth userId
        rating: v.number(),
        comment: v.string(),
        createdAt: v.number(),
    }).index("by_productId", ["productId"]),

    // Coupons table for discount codes
    coupons: defineTable({
        // Basic Information
        code: v.string(), // Unique coupon code (e.g., "SAVE20", "WELCOME10")
        description: v.string(), // What this coupon is for

        // Discount Configuration
        discountType: v.union(v.literal("percentage"), v.literal("flat")),
        discountValue: v.number(), // Percentage (e.g., 20 for 20%) or flat amount

        // Applicability Rules
        applicationType: v.union(
            v.literal("all"), // Apply to entire cart
            v.literal("category"), // Apply to specific categories
            v.literal("product") // Apply to specific products
        ),
        categoryIds: v.optional(v.array(v.string())), // Category IDs if applicationType is "category"
        productIds: v.optional(v.array(v.id("products"))), // Product IDs if applicationType is "product"

        // Constraints
        minimumPurchaseAmount: v.optional(v.number()), // Minimum cart value required
        maximumDiscountAmount: v.optional(v.number()), // Cap for percentage discounts

        // Usage Limits
        maxUsageCount: v.optional(v.number()), // Total times coupon can be used (null = unlimited)
        currentUsageCount: v.number(), // Track how many times used
        maxUsagePerUser: v.optional(v.number()), // Max uses per user (null = unlimited)

        // Validity Period
        startDate: v.number(), // Timestamp when coupon becomes active
        expiryDate: v.number(), // Timestamp when coupon expires

        // Status
        isActive: v.boolean(), // Admin can enable/disable manually

        // Metadata
        createdBy: v.string(), // Admin user ID
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_code", ["code"]) // Fast lookup by coupon code
        .index("by_isActive", ["isActive"]) // Query active coupons
        .index("by_expiryDate", ["expiryDate"]), // Cleanup expired coupons

    // Track individual coupon usages
    couponUsages: defineTable({
        couponId: v.id("coupons"),
        userId: v.string(), // Reference to userProfiles.userId
        orderId: v.optional(v.string()), // Link to order if you have orders table
        discountApplied: v.number(), // Actual discount amount given
        usedAt: v.number(),
    })
        .index("by_couponId", ["couponId"])
        .index("by_userId", ["userId"])
        .index("by_coupon_and_user", ["couponId", "userId"]), // Check per-user usage
});
