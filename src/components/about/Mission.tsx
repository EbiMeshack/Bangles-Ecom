

import { Quote } from "lucide-react";

const Mission = () => {
    return (
        <section className="py-24 md:py-32 bg-gray-50/50 dark:bg-white/5">
            <div className="container mx-auto px-4 max-w-4xl text-center">
                <Quote className="size-16 text-primary mb-8 mx-auto opacity-80" />
                <h2 className="text-[#181611] dark:text-gray-100 text-4xl md:text-5xl font-bold leading-tight tracking-[-0.015em] mb-6">
                    Our Mission
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-xl md:text-2xl leading-relaxed font-light">
                    To honor and preserve the art of Indian bangle making by connecting
                    discerning individuals with authentic, handcrafted pieces that embody
                    elegance, heritage, and ethical craftsmanship.
                </p>
            </div>
        </section>
    );
};

export default Mission;
