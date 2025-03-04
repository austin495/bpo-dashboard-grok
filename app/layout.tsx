import type { Metadata } from "next";
import { Geist, Manrope } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

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

export default function RootLayout({
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
            {children}
        </Providers>
      </body>
    </html>
  );
}