import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "../globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { FavoritesProvider } from "@/context/favorites-context";

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
          <FavoritesProvider>{children}</FavoritesProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
