

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
    ];

    return (
        <section className="py-20 md:py-32 bg-gray-50/50 dark:bg-white/5">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-[#181611] dark:text-gray-100 text-3xl md:text-4xl font-bold leading-tight tracking-[-0.015em] mb-4">
                        Meet Our Artisans
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        The hands and hearts behind every masterpiece.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {artisans.map((artisan, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className="w-48 h-48 rounded-full overflow-hidden mb-6 shadow-xl ring-4 ring-white dark:ring-gray-800 group-hover:ring-primary/20 transition-all duration-300">
                                <div
                                    className="bg-cover bg-center w-full h-full transform group-hover:scale-110 transition-transform duration-500"
                                    data-alt={artisan.alt}
                                    style={{ backgroundImage: `url("${artisan.image}")` }}
                                ></div>
                            </div>
                            <h3 className="font-bold text-[#181611] dark:text-gray-100 text-xl mb-1">
                                {artisan.name}
                            </h3>
                            <p className="text-primary font-medium tracking-wide text-sm uppercase mb-3 text-opacity-80">{artisan.role}</p>
                            <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed max-w-sm">
                                {artisan.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Artisans;
