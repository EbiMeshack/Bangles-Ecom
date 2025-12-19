import { z } from "zod";

// Signup form validation schema
export const signupSchema = z
    .object({
        name: z
            .string()
            .min(2, "Name must be at least 2 characters")
            .max(50, "Name must be less than 50 characters"),
        phone: z
            .string()
            .min(10, "Phone number must be at least 10 digits")
            .max(10, "Phone number must be less than 10 digits"),
        email: z
            .string()
            .email("Please enter a valid email address")
            .toLowerCase(),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                "Password must contain at least one uppercase letter, one lowercase letter, and one number"
            ),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

// Login form validation schema
export const loginSchema = z.object({
    email: z
        .string()
        .email("Please enter a valid email address")
        .toLowerCase(),
    password: z.string().min(1, "Password is required"),
});

// Type exports for TypeScript
export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;

// Complete Profile form validation schema
export const completeProfileSchema = z.object({
    phone: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .max(10, "Phone number must be less than 10 digits"),
});

export type CompleteProfileFormData = z.infer<typeof completeProfileSchema>;
