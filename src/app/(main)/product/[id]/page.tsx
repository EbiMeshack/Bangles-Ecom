import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductPageContent } from "@/components/product/ProductPageContent";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <div className="flex min-h-screen flex-col font-sans">
            <Header />
            <main className="flex-1">
                <ProductPageContent id={id} />
            </main>
            <Footer />
        </div>
    );
}
