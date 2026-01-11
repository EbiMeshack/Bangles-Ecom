"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Star, MessageSquare, Loader2, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useMutation } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ProductReviewsProps {
    productId: string;
    count: number;
}

export function ProductReviews({ productId, count }: ProductReviewsProps) {
    const reviews = useQuery(api.reviews.getReviewsByProductId, {
        productId: productId as Id<"products">,
    });

    const { data: session } = authClient.useSession();
    const addReview = useMutation(api.reviews.addReview);

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    const handleSubmit = async () => {
        if (!session?.user) {
            toast.error("Please sign in to write a review");
            return;
        }
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }
        if (!comment.trim()) {
            toast.error("Please write a comment");
            return;
        }

        setIsSubmitting(true);
        try {
            await addReview({
                productId: productId as Id<"products">,
                userId: session.user.id,
                rating,
                comment,
            });
            toast.success("Review submitted successfully");
            setRating(0);
            setComment("");
            setShowForm(false);
        } catch (error) {
            toast.error("Failed to submit review");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 decoration-dotted">
                    {count} {count === 1 ? 'review' : 'reviews'}
                </button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
                <SheetHeader>
                    <SheetTitle className="text-2xl font-bold flex items-center gap-2">
                        <MessageSquare className="w-6 h-6" />
                        Customer Reviews
                    </SheetTitle>
                    <SheetDescription>
                        Read what our customers have to say about this product.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6 py-6">
                    <div className="space-y-8">
                        {reviews === undefined ? (
                            // Loading State
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            ))
                        ) : reviews.length === 0 ? (
                            <div className="text-center py-12">
                                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                                <p className="text-muted-foreground font-medium">No reviews yet.</p>
                                <p className="text-sm text-muted-foreground/60 mt-1">Be the first to share your thoughts!</p>
                            </div>
                        ) : (
                            reviews.map((review) => (
                                <div key={review._id} className="space-y-3 pb-6 border-b last:border-0">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={cn(
                                                        "w-3.5 h-3.5",
                                                        i < review.rating
                                                            ? "fill-yellow-400 text-yellow-400"
                                                            : "fill-gray-200 text-gray-200"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs text-muted-foreground uppercase font-medium">
                                            {format(review.createdAt, "MMM d, yyyy")}
                                        </span>
                                    </div>
                                    <p className="text-sm leading-relaxed text-foreground/90 italic">
                                        "{review.comment}"
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-[10px] font-bold text-neutral-400 uppercase">
                                            {review.userId.substring(0, 2)}
                                        </div>
                                        <span className="text-[11px] font-semibold text-muted-foreground tracking-wider uppercase">
                                            Verified Buyer
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="border-t p-6">
                    {!showForm ? (
                        <Button
                            variant="outline"
                            className="w-full rounded-full"
                            onClick={() => {
                                if (!session?.user) {
                                    toast.error("Please sign in to write a review");
                                    return;
                                }
                                setShowForm(true);
                            }}
                        >
                            Write a Review
                        </Button>
                    ) : (
                        <div className="space-y-4 animate-in slide-in-from-bottom-5 fade-in duration-300">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-sm">Write your review</h3>
                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setShowForm(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="flex gap-1 justify-center py-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className="focus:outline-none transition-transform hover:scale-110"
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(star)}
                                    >
                                        <Star
                                            className={cn(
                                                "w-8 h-8 transition-all duration-200",
                                                (hoverRating || rating) >= star
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "fill-transparent text-gray-300 hover:text-yellow-200"
                                            )}
                                        />
                                    </button>
                                ))}
                            </div>

                            <Textarea
                                placeholder="Share your thoughts about this product..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="min-h-[100px] resize-none"
                            />

                            <div className="flex gap-2">
                                <Button
                                    className="flex-1"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || rating === 0 || !comment.trim()}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit Review"
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowForm(false)}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}

// Helper to keep the component clean
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
