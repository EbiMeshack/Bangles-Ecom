"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ScrollStack } from "@/components/ui/scroll-stack";

const features = [
    {
        title: "Authentic Craftsmanship",
        description:
            "Each bangle is handcrafted by skilled artisans in India, preserving generations of traditional techniques and cultural heritage.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_sU1iLkQn0mu9QLnc4RXbdHywcGzB1frWjThGLcZIDxDmNjodyUACEIjUXXWRwpx5Zl3nMpU9cM2l9LNfKXyPLzk-7W5FfglyvzPaMcX0DNduvPud2HquC5zuqQTYrWV1FnQJM6h7OPMPAu5zIxIv5z0DI8BoTynYq6zmpRbNjvanhyzHL6mmHi-PSfCsRaVxhOjNCQW38jxwdcKLfBtplL7K3XL6_fHnv1UrykIAZHu0bf4zZj4ynq7JfDJt5oeU209RQqfFi1o",
    },
    {
        title: "Quality Materials",
        description:
            "We use only high-quality, ethically sourced materials to ensure your bangles are both beautiful and durable.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC10lQV9GWOX2UsjBMrEK8pVOkknlqnundvi0eJu164yPNxInDaeRFebzMtnbj1wkQ8ZOMTBs68FyWBCdfJiPihAJNPnDDUwhIbuO2s1hXo_hTOLbX2mAMHc45KPtsryAC7MG9LYZplBpkYIO2Nub0FQ74MoYJBZghaP7EvBoJsROvXoBcaSZRCjZ04JprZsrPr-nAAr-mq2xaqauJfWdQDe_mk-h4LRq12kaGX5QP6m-_o0EYj-pqjrDzJyg33doTjgif50axRiPA",
    },
    {
        title: "Unique Designs",
        description:
            "Our collections blend timeless tradition with contemporary style, offering unique pieces you won't find anywhere else.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQsHCIwkq-LH_v8a9yEpD_xZVqqCGuiWmODzUeIIYyQQ0OlpNuNxf4ZHmAofEcY79yntw08DXE8R-W-6MePdzJz1zorTItHmC5z3Cn4zXqH2EJcTHQGFMG163cfdMl2u47MiqSotu_tJ4RmOAat1ZUZuQWFdPympE5es0VojZzPECvb5F9mLLAgDtLFnprax2B5K5hyZNktDp5rnEpPRoKnPoGieqaWUN_rPF6G55KKncGTYo-oGwdn7cczLFrlWbR-LcsTDV6yQI",
    },
];

export function Features() {
    return (
        <section className="container mx-auto px-4 py-16 md:py-24 md:px-12">
            <div className="flex flex-col items-center text-center mb-12 md:mb-16">
                <h2 className="text-3xl font-bold leading-tight tracking-[-0.015em] mb-4 md:text-4xl">
                    Why Choose Us?
                </h2>
                <p className="text-muted-foreground max-w-md">
                    Discover the Bangle Co. difference, where tradition meets modern elegance.
                </p>
            </div>

            <ScrollStack offset={60} className="gap-20">
                {features.map((feature) => (
                    <Card key={feature.title} className="bg-background border shadow-xl w-full mx-auto overflow-hidden p-0 gap-0 rounded-lg border-none">
                        <div className="flex flex-col md:flex-row h-full min-h-[500px]">
                            <div className="w-full md:w-1/2 aspect-square md:aspect-auto relative bg-muted">
                                <div
                                    className="absolute inset-0 bg-cover bg-center h-full w-full"
                                    style={{ backgroundImage: `url("${feature.image}")` }}
                                />
                            </div>
                            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                                <h3 className="text-2xl md:text-3xl font-bold mb-4">{feature.title}</h3>
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}
            </ScrollStack>
        </section>
    );
}

