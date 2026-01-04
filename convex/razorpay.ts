"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import Razorpay from "razorpay";

export const createOrder = action({
    args: {
        amount: v.number(),
        receipt: v.string(),
        currency: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        const options = {
            amount: args.amount, // amount in the smallest currency unit
            currency: args.currency || "INR",
            receipt: args.receipt,
        };

        try {
            const order = await razorpay.orders.create(options);
            return order;
        } catch (error) {
            console.error("Error creating Razorpay order:", error);
            throw new Error("Failed to create Razorpay order");
        }
    },
});
