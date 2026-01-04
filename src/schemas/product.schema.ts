import { z } from "zod";

export const productSchema = z.object({
    name: z.string().min(1, "Product name is required").max(100, "Name too long"),
    price: z.coerce.number().min(0, "Price must be positive"),
    category: z.string().min(1, "Category is required"),
    image: z.string().url("Must be a valid URL").min(1, "Image URL is required"),
    quantity: z.coerce.number().int().min(0, "Quantity must be a positive integer"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
