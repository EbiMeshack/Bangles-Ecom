import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

/**
 * Create a new user profile
 * Called after successful user registration
 */
export const createUserProfile = mutation({
    args: {
        userId: v.string(),
        email: v.string(),
        phoneNumber: v.string(),
        role: v.optional(v.string()), // Optional, defaults to "user"
        name: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        // Check if profile already exists
        const existingProfile = await ctx.db
            .query("userProfiles")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .first();

        if (existingProfile) {
            throw new Error("User profile already exists");
        }

        // Create the user profile
        const profileId = await ctx.db.insert("userProfiles", {
            userId: args.userId,
            email: args.email,
            phoneNumber: args.phoneNumber,
            role: args.role ?? "user", // Default to "user" if not provided
            name: args.name,
            createdAt: now,
            updatedAt: now,
        });

        return profileId;
    },
});

/**
 * Get user profile by userId
 */
export const getUserProfile = query({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const profile = await ctx.db
            .query("userProfiles")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .first();

        return profile;
    },
});

/**
 * Get the current user's profile
 * Automatically fetches the authenticated user's profile
 */
export const getCurrentUserProfile = query({
    args: {},
    handler: async (ctx) => {
        // Get the authenticated user
        const authUser = await authComponent.getAuthUser(ctx);

        if (!authUser) {
            return null;
        }

        // Fetch their profile
        const profile = await ctx.db
            .query("userProfiles")
            .withIndex("by_userId", (q) => q.eq("userId", authUser.userId ?? authUser._id))
            .first();

        return profile;
    },
});

/**
 * Update user profile
 */
export const updateUserProfile = mutation({
    args: {
        userId: v.string(),
        email: v.optional(v.string()),
        phoneNumber: v.optional(v.string()),
        role: v.optional(v.string()),
        name: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Find the existing profile
        const profile = await ctx.db
            .query("userProfiles")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .first();

        if (!profile) {
            throw new Error("User profile not found");
        }

        // Update the profile (only update provided fields)
        const updates: any = {
            updatedAt: Date.now(),
        };

        if (args.email !== undefined) {
            updates.email = args.email;
        }
        if (args.phoneNumber !== undefined) {
            updates.phoneNumber = args.phoneNumber;
        }
        if (args.role !== undefined) {
            updates.role = args.role;
        }
        if (args.name !== undefined) {
            updates.name = args.name;
        }

        await ctx.db.patch(profile._id, updates);

        return profile._id;
    },
});

/**
 * Get all users with a specific role
 * Useful for admin purposes
 */
export const getUsersByRole = query({
    args: {
        role: v.string(),
    },
    handler: async (ctx, args) => {
        const profiles = await ctx.db
            .query("userProfiles")
            .withIndex("by_role", (q) => q.eq("role", args.role))
            .collect();

        return profiles;
    },
});

/**
 * Delete user profile
 */
export const deleteUserProfile = mutation({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const profile = await ctx.db
            .query("userProfiles")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .first();

        if (!profile) {
            throw new Error("User profile not found");
        }

        await ctx.db.delete(profile._id);

        return { success: true };
    },
});
