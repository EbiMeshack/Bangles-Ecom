import Link from "next/link";

const categories = [
    {
        title: "The Wedding Collection",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_sU1iLkQn0mu9QLnc4RXbdHywcGzB1frWjThGLcZIDxDmNjodyUACEIjUXXWRwpx5Zl3nMpU9cM2l9LNfKXyPLzk-7W5FfglyvzPaMcX0DNduvPud2HquC5zuqQTYrWV1FnQJM6h7OPMPAu5zIxIv5z0DI8BoTynYq6zmpRbNjvanhyzHL6mmHi-PSfCsRaVxhOjNCQW38jxwdcKLfBtplL7K3XL6_fHnv1UrykIAZHu0bf4zZj4ynq7JfDJt5oeU209RQqfFi1o",
        alt: "A close-up of intricate gold bangles with detailed filigree work, suitable for a wedding.",
    },
    {
        title: "Everyday Elegance",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPYHq2wzxu6wwjjnORxEe86RdEz5RlmI6DvHwkl8Yn5IiZvh5unAPn_5CM7SihqK3xcaBavZmq-9fl2k2c9rkpY7tisOR1GIXtTO3DOYCHGWuwKlK6N5kxvlOhuP3N1aoeEGGCCYwLCZB6M2xm_dbVB3WLyWtdSseASz7INwd0Oug8OUiEwCOnfrG8oMYCrw7TB1BA7Uhe1gsyh8rU5mmCV-ErpjNyIis_tojCkj1-NLIq00ihh548s4LaIsNWHb58oMyu8XO0_e4",
        alt: "A simple yet elegant set of silver and white bangles, perfect for daily wear.",
    },
    {
        title: "Artisan Metals",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBH0qY5YS0avcfLRWvskUCh6KMNblT8-nPCIrbmZbLtp4K1e15J2UXPUGhP3CRTaUD6K0zD19AIN9gemQ2t92GHdtMQ4XRxUf26D92N4DBx7BfdObRZEFHPhoKDPSduDZsx7JkZWPKHGQSJS0XiUKGG1-FM6jb4EdsxIFdPqEGLdw3EhmlIKe1LjvO_bXvvfQFS7GLJcczMnWFzVWLXa0gJ74pT_MJxVC7Mwu70_5AMDK19tQ2LR4swQKoNUMoc6mEcCel5F0rlgM0",
        alt: "Oxidized silver bangles with tribal-inspired embossed patterns.",
    },
    {
        title: "Glass Bangles",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnNyDoMD3wmS1l-EeHdOtlsbWEypi8jnTHKpOGxCzGguN7TIB_eEAEnzOFWc7lxJ1pO3fg8yYQX0HSQViqO5qjQYL5QLUy6YZ8roZbLBH5B0cnu0TtNQrTM_Ev0PCaUdVvScnGG93N0Cs4P3Q_wZur91ZdDvqJLxlMrXR1ISC_QqpLGJ7q0l1yFJ1Uzv6q2AWnKpNBJbq1fxootFGpWI4gjRGjnCjA7qKEUwnmBiYxtoQJJjg_ZUensjKipNBzSPoXutPvK346YbM",
        alt: "A stack of vibrant, multi-colored glass bangles shimmering in the light.",
    },
];

export function CategoryGrid() {
    return (
        <section className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em] mb-4">
                Shop by Category
            </h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-4">
                {categories.map((category) => (
                    <Link
                        key={category.title}
                        href="#"
                        className="group relative flex aspect-square flex-col justify-end overflow-hidden rounded-lg bg-cover bg-center p-4 transition-transform hover:scale-105 hover:shadow-lg"
                        style={{
                            backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%), url("${category.image}")`,
                        }}
                    >
                        <span className="relative z-10 w-4/5 text-base font-bold leading-tight text-white line-clamp-2">
                            {category.title}
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
