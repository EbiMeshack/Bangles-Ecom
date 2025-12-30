import { z } from "zod";

export const couponSchema = z.object({
    code: z
        .string()
        .min(1, "Coupon code is required")
        .max(20, "Coupon code cannot exceed 20 characters")
        .transform((val) => val.toUpperCase()),
    description: z.string().min(1, "Description is required"),
    discountType: z.enum(["percentage", "flat"]),
    discountValue: z.coerce
        .number()
        .min(0, "Discount value must be greater than or equal to 0"),
    applicationType: z.enum(["all", "category", "product"]),
    categoryIds: z.array(z.string()).optional(),
    productIds: z.array(z.string()).optional(),
    minimumPurchaseAmount: z.coerce.number().optional(),
    maximumDiscountAmount: z.coerce.number().optional(),
    maxUsageCount: z.coerce.number().int().min(1).optional(),
    maxUsagePerUser: z.coerce.number().int().min(1).optional(),
    startDate: z.date(),
    expiryDate: z.date(),
    isActive: z.boolean().default(true),
}).superRefine((data, ctx) => {
    if (data.discountType === "percentage" && data.discountValue > 100) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Percentage discount cannot exceed 100%",
            path: ["discountValue"],
        });
    }

    if (data.startDate >= data.expiryDate) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Expiry date must be after start date",
            path: ["expiryDate"],
        });
    }

    if (
        data.applicationType === "category" &&
        (!data.categoryIds || data.categoryIds.length === 0)
    ) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select at least one category",
            path: ["categoryIds"],
        });
    }

    if (
        data.applicationType === "product" &&
        (!data.productIds || data.productIds.length === 0)
    ) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select at least one product",
            path: ["productIds"],
        });
    }
});

export type CouponFormValues = z.infer<typeof couponSchema>;
