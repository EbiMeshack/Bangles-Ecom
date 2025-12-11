import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CollectionsView } from "@/components/collections/CollectionsView";
import products from "@/data/products.json";

export default function CollectionsPage() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Header />
      <main className="flex-1">
        <CollectionsView initialProducts={products} />
      </main>
      <Footer />
    </div>
  );
}
