import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
    return (
        <section className="container mx-auto px-4 py-16 md:py-24 text-center">
            <div className="max-w-2xl mx-auto">
                <div className="size-12 text-primary mx-auto mb-4">
                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
                    </svg>
                </div>
                <h2 className="text-3xl font-bold leading-tight tracking-[-0.015em] mb-2 md:text-4xl">
                    Join Our Community
                </h2>
                <p className="text-muted-foreground mb-8">
                    Subscribe to our newsletter for exclusive offers, new arrivals, and a touch of tradition in your inbox.
                </p>
                <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                    <Input
                        id="newsletter-email"
                        type="email"
                        placeholder="Enter your email"
                        className="h-12 flex-grow"
                    />
                    <Button type="submit" size="lg" className="h-12 font-bold px-8">
                        Subscribe
                    </Button>
                </form>
            </div>
        </section>
    );
}
