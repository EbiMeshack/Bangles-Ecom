import { query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { Id, Doc } from "./_generated/dataModel";

// Query to get all products with professional pagination and filtering
export const getAllProducts = query({
    args: {
        paginationOpts: paginationOptsValidator,
        search: v.optional(v.string()),
        category: v.optional(v.string()),
        minPrice: v.optional(v.number()),
        maxPrice: v.optional(v.number()),
        minRating: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const productsQuery = args.category
            ? ctx.db.query("products").withIndex("by_category", (q) => q.eq("category", args.category!))
            : ctx.db.query("products");

        const result = await productsQuery
            .order("desc")
            .filter((q) =>
                q.and(
                    args.minPrice !== undefined ? q.gte(q.field("price"), args.minPrice) : true,
                    args.maxPrice !== undefined ? q.lte(q.field("price"), args.maxPrice) : true
                )
            )
            .paginate(args.paginationOpts);

        // Enhance results with ratings and apply remaining filters
        const pageWithRatings = await Promise.all(
            result.page.map(async (product) => {
                const reviews = await ctx.db
                    .query("reviews")
                    .withIndex("by_productId", (q) => q.eq("productId", product._id))
                    .collect();

                const averageRating = reviews.length > 0
                    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
                    : 0;

                return {
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    category: product.category,
                    image: product.image,
                    rating: Math.round(averageRating * 10) / 10,
                    reviews: reviews.length,
                    stockQuantity: product.quantity,
                };
            })
        );

        // Refined filtering on the retrieved page
        let finalPage = pageWithRatings;
        if (args.search) {
            const searchLower = args.search.toLowerCase();
            finalPage = finalPage.filter(p => p.name.toLowerCase().includes(searchLower));
        }
        if (args.minRating !== undefined) {
            finalPage = finalPage.filter(p => p.rating >= args.minRating!);
        }

        return {
            ...result,
            page: finalPage,
        };
    },
});

// Query to get products by category (legacy/simple support)
export const getProductsByCategory = query({
    args: { category: v.string() },
    handler: async (ctx, args) => {
        const products = await ctx.db
            .query("products")
            .withIndex("by_category", (q) => q.eq("category", args.category))
            .collect();

        const productsWithRatings = await Promise.all(
            products.map(async (product) => {
                const reviews = await ctx.db
                    .query("reviews")
                    .withIndex("by_productId", (q) => q.eq("productId", product._id))
                    .collect();

                const averageRating = reviews.length > 0
                    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
                    : 0;

                return {
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    category: product.category,
                    image: product.image,
                    rating: Math.round(averageRating * 10) / 10,
                    reviews: reviews.length,
                    stockQuantity: product.quantity,
                };
            })
        );

        return productsWithRatings;
    },
});

// Query to get featured products (one from each category)
export const getFeaturedProducts = query({
    args: {},
    handler: async (ctx) => {
        const allProducts = await ctx.db.query("products").collect();

        const categoriesMap = new Map();
        allProducts.forEach((product) => {
            if (!categoriesMap.has(product.category)) {
                categoriesMap.set(product.category, product);
            }
        });

        const uniqueProducts = Array.from(categoriesMap.values());

        const productsWithRatings = await Promise.all(
            uniqueProducts.map(async (product) => {
                const reviews = await ctx.db
                    .query("reviews")
                    .withIndex("by_productId", (q) => q.eq("productId", product._id))
                    .collect();

                const averageRating = reviews.length > 0
                    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
                    : 0;

                return {
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    category: product.category,
                    image: product.image,
                    rating: Math.round(averageRating * 10) / 10,
                    reviews: reviews.length,
                    stockQuantity: product.quantity,
                };
            })
        );

        return productsWithRatings;
    },
});

// Query to get multiple products by their IDs
export const getProductsByIds = query({
    args: { ids: v.array(v.string()) },
    handler: async (ctx, args) => {
        // Filter out any IDs that aren't valid product IDs
        const productIds = args.ids
            .map(id => ctx.db.normalizeId("products", id))
            .filter((id): id is Id<"products"> => id !== null);

        const products = await Promise.all(
            productIds.map(id => ctx.db.get(id))
        );

        // Filter out potentially null results if an ID was deleted
        const validProducts = products.filter((p): p is Doc<"products"> => p !== null);

        return Promise.all(
            validProducts.map(async (product) => {
                const reviews = await ctx.db
                    .query("reviews")
                    .withIndex("by_productId", (q) => q.eq("productId", product._id))
                    .collect();

                const averageRating = reviews.length > 0
                    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
                    : 0;

                return {
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    category: product.category,
                    image: product.image,
                    rating: Math.round(averageRating * 10) / 10,
                    reviews: reviews.length,
                    stockQuantity: product.quantity,
                };
            })
        );
    },
});

// Professional boundary query for collection metadata
export const getCollectionMetadata = query({
    args: {},
    handler: async (ctx) => {
        const products = await ctx.db.query("products").collect();
        const categories = Array.from(new Set(products.map(p => p.category)));
        const prices = products.map(p => p.price);

        return {
            categories,
            minPrice: prices.length > 0 ? Math.min(...prices) : 0,
            maxPrice: prices.length > 0 ? Math.max(...prices) : 1000,
            totalCount: products.length,
        };
    },
});

// Query to get related products (same category, excluding current product)
export const getRelatedProducts = query({
    args: { productId: v.id("products"), category: v.string(), limit: v.number() },
    handler: async (ctx, args) => {
        const products = await ctx.db
            .query("products")
            .withIndex("by_category", (q) => q.eq("category", args.category))
            .collect();

        // Filter out current product and limit results
        const filteredProducts = products
            .filter((p) => p._id !== args.productId)
            .slice(0, args.limit);

        return Promise.all(
            filteredProducts.map(async (product) => {
                const reviews = await ctx.db
                    .query("reviews")
                    .withIndex("by_productId", (q) => q.eq("productId", product._id))
                    .collect();

                const averageRating = reviews.length > 0
                    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
                    : 0;

                return {
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    category: product.category,
                    image: product.image,
                    rating: Math.round(averageRating * 10) / 10,
                    reviews: reviews.length,
                    stockQuantity: product.quantity,
                };
            })
        );
    },
});