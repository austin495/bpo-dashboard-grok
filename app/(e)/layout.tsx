import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import type { Metadata } from "next";
import { Geist, Manrope } from "next/font/google";
import "../globals.css";
import { Providers } from "../providers";
import { HeaderSearch } from "@/components/header-search";
import { Notification } from "@/components/notification";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EvolveTech Innovations | Digital Marketing &amp; Lead Generation Experts",
  description: "EvolveTech Innovations delivers expert digital marketing and lead generation solutions for businesses in healthcare, finance, and home services. Boost your growth with our tailored strategies.",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex justify-between h-16 shrink-0 items-center gap-2 border-b pr-3">
                <div className="flex items-center gap-2 px-3">
                  <SidebarTrigger />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <HeaderSearch />
                </div>
                <div>
                  <Notification />
                </div>
              </header>
              {children}
            </SidebarInset>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
