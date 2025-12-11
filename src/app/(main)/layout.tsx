import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "../globals.css";

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
        {children}
      </body>
    </html>
  );
}
