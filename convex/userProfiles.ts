import { v } from "convex/values";
import { mutation, query, QueryCtx, MutationCtx } from "./_generated/server";
import { authComponent } from "./auth";

/**
 * Helper to check if the current user is an admin.
 * Throws an error if not authenticated or not an admin.
 */
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
 * Get all user profiles (Admin only)
 */
export const getAllUserProfiles = query({
    args: {},
    handler: async (ctx) => {
        await checkAdmin(ctx);

        const profiles = await ctx.db.query("userProfiles").collect();
        return profiles;
    },
});

/**
 * Update user profile
 * - Users can update their own non-sensitive fields.
 * - Admins can update all fields including role.
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
        const authUser = await authComponent.getAuthUser(ctx);
        if (!authUser) {
            throw new Error("Unauthorized");
        }

        // Fetch user's profile to check role
        const requesterProfile = await ctx.db
            .query("userProfiles")
            .withIndex("by_userId", (q) => q.eq("userId", authUser.userId ?? authUser._id))
            .first();

        const isAdmin = requesterProfile?.role === "admin";

        // Find the target profile to update
        const targetProfile = await ctx.db
            .query("userProfiles")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .first();

        if (!targetProfile) {
            throw new Error("User profile not found");
        }

        // Authorization check
        const isSelf = (authUser.userId ?? authUser._id) === args.userId;

        if (!isAdmin && !isSelf) {
            throw new Error("Unauthorized: You can only update your own profile");
        }

        if (!isAdmin && args.role && args.role !== targetProfile.role) {
            throw new Error("Unauthorized: Only admins can change roles");
        }

        // Update the profile 
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
            // Logic above ensures non-admins can't change role to something else
            // If they send their current role it's fine, if they send diff role, it throws.
            // But to be safer, strictly only allow role update if admin
            if (isAdmin) {
                updates.role = args.role;
            }
        }
        if (args.name !== undefined) {
            updates.name = args.name;
        }

        await ctx.db.patch(targetProfile._id, updates);

        return targetProfile._id;
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
 * Delete user profile (Admin only)
 */
export const deleteUserProfile = mutation({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        await checkAdmin(ctx);

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
