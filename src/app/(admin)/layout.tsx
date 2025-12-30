import AdminAuthMiddleware from "@/components/AdminAuthMiddleware";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "../globals.css";

const workSans = Work_Sans({
    variable: "--font-work-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Bangle Co.",
    description: "Admin Dashboard.",
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
                    <AdminAuthMiddleware>
                        <SidebarProvider>
                            <AppSidebar />
                            <SidebarInset>
                                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                                    <SidebarTrigger className="-ml-1" />
                                    <span className="font-medium">Admin Dashboard</span>
                                </header>
                                <main className="flex-1 p-4">
                                    {children}
                                </main>
                            </SidebarInset>
                        </SidebarProvider>
                    </AdminAuthMiddleware>
                </ConvexClientProvider>
            </body>
        </html>
    );
}
