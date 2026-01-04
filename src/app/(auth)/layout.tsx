import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "../globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { RedirectAuthenticatedUser } from "@/components/AdminAuthMiddleware";

const workSans = Work_Sans({
    variable: "--font-work-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Bangle Co. - Indian Bangles E-commerce",
    description: "Discover handcrafted Indian bangles for every occasion.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${workSans.variable} antialiased font-sans`}
            >
                <ConvexClientProvider>
                    <RedirectAuthenticatedUser>
                        {children}
                    </RedirectAuthenticatedUser>
                </ConvexClientProvider>
            </body>
        </html>
    );
}