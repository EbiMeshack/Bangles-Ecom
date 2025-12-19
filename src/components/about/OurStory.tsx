
const OurStory = () => {
    return (
        <section className="py-20 md:py-32">
            <div className="container mx-auto px-4 md:px-12">
                <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                    <div className="order-2 md:order-1">
                        <div className="relative inline-block mb-6">
                            <h2 className="text-[#181611] dark:text-gray-100 text-3xl md:text-4xl font-bold leading-tight tracking-[-0.015em] relative z-10">
                                Our Story
                            </h2>
                            <svg
                                className="absolute -bottom-2 left-0 w-full h-3 text-primary md:hidden -z-0"
                                viewBox="0 0 100 10"
                                preserveAspectRatio="none"
                            >
                                <path
                                    d="M0 5 Q 50 10 100 5"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    fill="none"
                                />
                            </svg>
                        </div>
                        <div className="space-y-6 text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                            <p>
                                Founded on a deep-rooted passion for Indian craftsmanship, Bangle
                                Co. began as a small dream to share the timeless beauty of bangles
                                with the world. We traveled through the vibrant heartlands of India,
                                from the bustling markets of Jaipur to the serene artisan villages
                                of Bengal, discovering the rich stories and intricate skills passed
                                down through generations.
                            </p>
                            <p>
                                Each piece in our collection is a testament to this journey,
                                carefully curated to represent the pinnacle of traditional artistry
                                and contemporary design. We partner directly with master artisans,
                                ensuring that every bangle not only adorns your wrist but also
                                carries with it a legacy of culture and dedication.
                            </p>
                        </div>
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                            <div
                                className="bg-cover bg-center w-full h-full transform hover:scale-105 transition-transform duration-700"
                                data-alt="An Indian artisan's hands delicately painting a traditional design onto a bangle."
                                style={{
                                    backgroundImage:
                                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA52hIT4KdKFwupr4I_HZBY0agiW747uhLkd06r34Qu4SN8xM7_M7gqF2WBvJn1wZmp5742juH1-sj6mXp_YEaiR7bDQ1RKyXeOY4Nsy8MUaywIdv90qkPXvSoPgE8UeR-1Qu99zar2lZ4nPlaPfSXhGDlmgxSmXFlRGxLOFwolR28W9pE0Satn1rONyrjRUJc9k_nMet08Y6uVkNna9G2DoCxrHuPbRArolakcZVlrN1fE-2lw_C_RV_RaoVmaR4kKktu0DftvHJE")',
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OurStory;
