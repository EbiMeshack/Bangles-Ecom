import { Button } from "@/components/ui/button";

export function Hero() {
    return (
        <div className="container mx-auto px-4 py-6 md:py-10 md:px-12">
            <div
                className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl items-center justify-center p-4 text-center"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuC_YMU7S6BycaWIvsN-CUcW6AnH3UrHqGCCRRdF0_xRv_jar0bD7Q5gF_I802EVdd-8epLoBs2SxYqOdviHoL778rgvpHeN0V8iYJzcmNzfoUDHGGKVrPuomEUYqsfpON4iM-Qxe1DoUx84H7uNQAxuPzF8Nr9TqZWg-RyeoiWdkS1ghVWnDFYPPLjb00oIH1eUhG4Hjhp-GkNrS55tro37FIVGPVmTevWpejtRYhhyhhlXOL71uwWNWzDar0fxlUtCX_X5a0XHPkw")`
                }}
            >
                <div className="max-w-3xl space-y-2">
                    <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl">
                        Adorn Your Traditions.
                    </h1>
                    <h2 className="text-white text-sm md:text-base font-normal">
                        Discover handcrafted Indian bangles for every occasion.
                    </h2>
                </div>
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8">
                    Explore Collections
                </Button>
            </div>
        </div>
    );
}
