import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function Contact() {
    return (
        <section className="bg-white/50 dark:bg-black/20 py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="grid gap-12 md:grid-cols-2 items-center max-w-4xl mx-auto">
                    <div className="">
                        <h2 className="text-3xl font-bold leading-tight tracking-[-0.015em] mb-2 md:text-4xl">
                            Get in Touch
                        </h2>
                        <p className="text-muted-foreground mb-8">
                            Have a question or a special request? We&apos;d love to hear from you. Fill out the form or email us directly.
                        </p>
                        <div className="space-y-4">
                            <p className="flex items-center gap-3">
                                <Mail className="size-5 text-primary" />
                                <span>hello@bangleco.com</span>
                            </p>
                            <p className="flex items-center gap-3">
                                <Phone className="size-5 text-primary" />
                                <span>+1 (555) 123-4567</span>
                            </p>
                            <p className="flex items-center gap-3">
                                <MapPin className="size-5 text-primary" />
                                <span>Mumbai, India & New York, USA</span>
                            </p>
                        </div>
                    </div>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="sr-only">Name</label>
                            <Input id="name" placeholder="Your Name" className="bg-background h-12" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="sr-only">Email</label>
                            <Input id="email" type="email" placeholder="Your Email" className="bg-background h-12" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="message" className="sr-only">Message</label>
                            <Textarea id="message" placeholder="Your Message" rows={4} className="bg-background resize-none field-sizing-fixed" />
                        </div>
                        <Button type="submit" size="lg" className="w-full font-bold h-12">
                            Send Message
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    );
}
