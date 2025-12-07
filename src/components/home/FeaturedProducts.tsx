import { Card, CardContent, CardFooter } from "@/components/ui/card";

const products = [
    {
        name: "Rani Gold Kada",
        price: "$120.00",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC10lQV9GWOX2UsjBMrEK8pVOkknlqnundvi0eJu164yPNxInDaeRFebzMtnbj1wkQ8ZOMTBs68FyWBCdfJiPihAJNPnDDUwhIbuO2s1hXo_hTOLbX2mAMHc45KPtsryAC7MG9LYZplBpkYIO2Nub0FQ74MoYJBZghaP7EvBoJsROvXoBcaSZRCjZ04JprZsrPr-nAAr-mq2xaqauJfWdQDe_mk-h4LRq12kaGX5QP6m-_o0EYj-pqjrDzJyg33doTjgif50axRiPA",
    },
    {
        name: "Chandni Silver Pair",
        price: "$75.00",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA52hIT4KdKFwupr4I_HZBY0agiW747uhLkd06r34Qu4SN8xM7_M7gqF2WBvJn1wZmp5742juH1-sj6mXp_YEaiR7bDQ1RKyXeOY4Nsy8MUaywIdv90qkPXvSoPgE8UeR-1Qu99zar2lZ4nPlaPfSXhGDlmgxSmXFlRGxLOFwolR28W9pE0Satn1rONyrjRUJc9k_nMet08Y6uVkNna9G2DoCxrHuPbRArolakcZVlrN1fE-2lw_C_RV_RaoVmaR4kKktu0DftvHJE",
    },
    {
        name: "Bridal Chooda Set",
        price: "$95.00",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVQaPCqAcU7qXYCdqbX8d3Xd6_Rob2jbpLdnLysQVUk33INr8plY9IbK7LlTinusBoK7Mm3eS1V9Ghq5exPx3vHwPRTwIuBdFzbNP3p54YMptlDdXXopV7UXfZIrVGKkNgN6tqKOL7WgZQCI_LMZFXeQQt7rQLMdsIcQt57wFl-41bsLFaOaqodlAV85zZBe9s4Sybootp5G9sTTio8VUBc609cwx-LClFlsukOMeBtFt42P6YeluA-iBsVaUzr6uL_7u2sRdDx9A",
    },
    {
        name: "Rainbow Glass Set",
        price: "$40.00",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQsHCIwkq-LH_v8a9yEpD_xZVqqCGuiWmODzUeIIYyQQ0OlpNuNxf4ZHmAofEcY79yntw08DXE8R-W-6MePdzJz1zorTItHmC5z3Cn4zXqH2EJcTHQGFMG163cfdMl2u47MiqSotu_tJ4RmOAat1ZUZuQWFdPympE5es0VojZzPECvb5F9mLLAgDtLFnprax2B5K5hyZNktDp5rnEpPRoKnPoGieqaWUN_rPF6G55KKncGTYo-oGwdn7cczLFrlWbR-LcsTDV6yQI",
    },
];

export function FeaturedProducts() {
    return (
        <section className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em] mb-4">
                Featured Products
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                    <Card key={product.name} className="overflow-hidden border-none shadow-none bg-transparent group">
                        <CardContent className="p-0">
                            <div className="overflow-hidden rounded-lg">
                                <div
                                    className="aspect-square bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                                    style={{ backgroundImage: `url("${product.image}")` }}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col items-start gap-1 p-0 pt-2">
                            <h3 className="font-semibold text-foreground">{product.name}</h3>
                            <p className="text-muted-foreground">{product.price}</p>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </section>
    );
}
