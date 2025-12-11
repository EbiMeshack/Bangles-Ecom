import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Features } from "@/components/home/Features";
import { FAQ } from "@/components/home/FAQ";
import { Contact } from "@/components/home/Contact";
import { Newsletter } from "@/components/home/Newsletter";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Header />
      <main className="flex-1">
        <Hero />
        <CategoryGrid />
        <FeaturedProducts />
        <Features />
        <FAQ />
        <Contact />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
