

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

const Artisans = () => {
    const artisans = [
        {
            name: 'Priya Sharma',
            role: 'Master of Meenakari',
            description:
                "Priya's family has been perfecting the art of Meenakari (enameling) for over five generations. Her intricate floral motifs bring our gold bangles to life.",
            image:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuDVQaPCqAcU7qXYCdqbX8d3Xd6_Rob2jbpLdnLysQVUk33INr8plY9IbK7LlTinusBoK7Mm3eS1V9Ghq5exPx3vHwPRTwIuBdFzbNP3p54YMptlDdXXopV7UXfZIrVGKkNgN6tqKOL7WgZQCI_LMZFXeQQt7rQLMdsIcQt57wFl-41bsLFaOaqodlAV85zZBe9s4Sybootp5G9sTTio8VUBc609cwx-LClFlsukOMeBtFt42P6YeluA-iBsVaUzr6uL_7u2sRdDx9A',
            alt: 'Portrait of a smiling female Indian artisan in a workshop setting.',
        },
        {
            name: 'Rohan Das',
            role: 'Glass Bangle Specialist',
            description:
                'From the famed glass workshops of Firozabad, Rohan is a visionary who expertly shapes molten glass into vibrant, shimmering circles of color.',
            image:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuC10lQV9GWOX2UsjBMrEK8pVOkknlqnundvi0eJu164yPNxInDaeRFebzMtnbj1wkQ8ZOMTBs68FyWBCdfJiPihAJNPnDDUwhIbuO2s1hXo_hTOLbX2mAMHc45KPtsryAC7MG9LYZplBpkYIO2Nub0FQ74MoYJBZghaP7EvBoJsROvXoBcaSZRCjZ04JprZsrPr-nAAr-mq2xaqauJfWdQDe_mk-h4LRq12kaGX5QP6m-_o0EYj-pqjrDzJyg33doTjgif50axRiPA',
            alt: 'Portrait of a focused male Indian artisan working with metal.',
        },
        {
            name: 'Aanya Verma',
            role: 'Silver Filigree Expert',
            description:
                "Aanya's delicate touch and keen eye are behind our stunning silver filigree bangles. Her work is a delicate dance of twisted silver threads.",
            image:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuAPYHq2wzxu6wwjjnORxEe86RdEz5RlmI6DvHwkl8Yn5IiZvh5unAPn_5CM7SihqK3xcaBavZmq-9fl2k2c9rkpY7tisOR1GIXtTO3DOYCHGWuwKlK6N5kxvlOhuP3N1aoeEGGCCYwLCZB6M2xm_dbVB3WLyWtdSseASz7INwd0Oug8OUiEwCOnfrG8oMYCrw7TB1BA7Uhe1gsyh8rU5mmCV-ErpjNyIis_tojCkj1-NLIq00ihh548s4LaIsNWHb58oMyu8XO0_e4',
            alt: 'Portrait of an elderly Indian artisan with detailed silverwork.',
        },
        {
            name: 'Vikram Singh',
            role: 'Gemstone Setter',
            description:
                'With hands as steady as rock, Vikram embeds precious stones into our bangles with precision. His work ensures that every gem shines its brightest.',
            image:
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            alt: 'Portrait of a focused male artisan working with gemstones.',
        },
        {
            name: 'Meera Patel',
            role: 'Lac Bangle Artist',
            description:
                'Meera carries forward the vibrant tradition of Lac bangles. Her colorful creations are a testament to the rich cultural heritage of Rajasthan.',
            image:
                'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            alt: 'Portrait of a female artisan holding colorful bangles.',
        },
    ];

    return (
        <section className="py-20 md:py-32">
            <div className="container mx-auto px-4 md:px-12">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <h2 className="text-[#181611] dark:text-gray-100 text-3xl md:text-4xl font-bold leading-tight tracking-[-0.015em] max-w-2xl text-left">
                        Meet the talented artisans who make all this happen
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-base md:text-base max-w-md text-left leading-relaxed mb-1">
                        The hands and hearts behind every masterpiece. We believe in preserving age-old traditions while empowering the creators to do their best work.
                    </p>
                </div>
                <Carousel
                    opts={{
                        align: 'start',
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4">
                        {artisans.map((artisan, index) => (
                            <CarouselItem key={index} className="pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                                <div className="flex flex-col items-start text-left group select-none">
                                    <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4 shadow-sm dark:ring-gray-800 transition-all duration-300">
                                        <div
                                            className="bg-cover bg-center w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                                            data-alt={artisan.alt}
                                            style={{ backgroundImage: `url("${artisan.image}")` }}
                                        ></div>
                                    </div>
                                    <h3 className="font-bold text-[#181611] dark:text-gray-100 text-lg mb-1">
                                        {artisan.name}
                                    </h3>
                                    <p className="text-primary font-medium tracking-wide text-xs uppercase mb-2 text-opacity-80">
                                        {artisan.role}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 md:line-clamp-none">
                                        {artisan.description}
                                    </p>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="flex justify-end gap-2 mt-8 md:mt-12 mr-2">
                        <CarouselPrevious className="static translate-y-0" />
                        <CarouselNext className="static translate-y-0" />
                    </div>
                </Carousel>
            </div>
        </section>
    );
};

export default Artisans;
