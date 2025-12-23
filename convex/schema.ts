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
});
