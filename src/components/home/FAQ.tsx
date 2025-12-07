import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
    return (
        <section className="container mx-auto px-4 pt-8 pb-16 md:pt-8 md:pb-24">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold leading-tight tracking-[-0.015em] mb-2 md:text-4xl">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Find answers to common questions about our products and services.
                    </p>
                </div>
                <Accordion type="single" collapsible className="w-full space-y-4 mx-auto">
                    <AccordionItem value="item-1" className="bg-white/80 dark:bg-black/20 rounded-lg px-8 border-none">
                        <AccordionTrigger className="hover:no-underline hover:text-primary py-6">
                            What materials are your bangles made of?
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                            Our bangles are crafted from a variety of materials including glass, lac, silver, gold-plated metals, and oxidized metals. Each product description provides specific details about the materials used.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2" className="bg-white/80 dark:bg-black/20 rounded-lg px-8 border-none">
                        <AccordionTrigger className="hover:no-underline hover:text-primary py-6">
                            How do I find the right bangle size?
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                            We have a comprehensive size guide available on our website. You can measure the diameter of a bangle you already own or measure your hand to find the perfect fit. Please refer to our &apos;Sizing Guide&apos; page for detailed instructions.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3" className="bg-white/80 dark:bg-black/20 rounded-lg px-8 border-none">
                        <AccordionTrigger className="hover:no-underline hover:text-primary py-6">
                            What is your shipping and return policy?
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                            We offer worldwide shipping. Orders are typically processed within 2-3 business days. We accept returns within 30 days of purchase for unused items in their original packaging. Please see our &apos;Shipping & Returns&apos; page for full details.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </section>
    );
}
