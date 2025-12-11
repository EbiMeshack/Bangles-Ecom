
import { Leaf, Gem, Handshake } from "lucide-react";

const Values = () => {
    return (
        <section className="py-20 md:py-32">
            <div className="container mx-auto px-4 md:px-12">
                <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                    <div>
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl -rotate-2 hover:rotate-0 transition-transform duration-500">
                            <div
                                className="bg-cover bg-center w-full h-full transform hover:scale-105 transition-transform duration-700"
                                data-alt="A vibrant, colorful display of stacked Indian bangles of various materials and designs."
                                style={{
                                    backgroundImage:
                                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBQsHCIwkq-LH_v8a9yEpD_xZVqqCGuiWmODzUeIIYyQQ0OlpNuNxf4ZHmAofEcY79yntw08DXE8R-W-6MePdzJz1zorTItHmC5z3Cn4zXqH2EJcTHQGFMG163cfdMl2u47MiqSotu_tJ4RmOAat1ZUZuQWFdPympE5es0VojZzPECvb5F9mLLAgDtLFnprax2B5K5hyZNktDp5rnEpPRoKnPoGieqaWUN_rPF6G55KKncGTYo-oGwdn7cczLFrlWbR-LcsTDV6yQI")',
                                }}
                            ></div>
                        </div>
                    </div>
                    <div>
                        <div className="relative inline-block mb-10">
                            <h2 className="text-[#181611] dark:text-gray-100 text-3xl md:text-4xl font-bold leading-tight tracking-[-0.015em] relative z-10">
                                Our Values
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
                        <ul className="space-y-10">
                            <li className="group">
                                <div className="flex items-center gap-4 mb-3">
                                    <h3 className="font-bold text-[#181611] dark:text-gray-100 text-xl">
                                        Authenticity
                                    </h3>
                                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                                        <Leaf className="size-6 text-primary" />
                                    </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    We are committed to genuine craftsmanship, sourcing directly
                                    from artisans and communities that are masters of their trade.
                                </p>
                            </li>
                            <li className="group">
                                <div className="flex items-center gap-4 mb-3">
                                    <h3 className="font-bold text-[#181611] dark:text-gray-100 text-xl">
                                        Quality
                                    </h3>
                                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                                        <Gem className="size-6 text-primary" />
                                    </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    From the materials we select to the finishing touches, we uphold
                                    the highest standards to ensure every piece is a work of art.
                                </p>
                            </li>
                            <li className="group">
                                <div className="flex items-center gap-4 mb-3">
                                    <h3 className="font-bold text-[#181611] dark:text-gray-100 text-xl">
                                        Respect
                                    </h3>
                                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                                        <Handshake className="size-6 text-primary" />
                                    </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    We believe in fair trade and ethical practices, ensuring our
                                    artisan partners are compensated fairly for their incredible
                                    skill.
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Values;
