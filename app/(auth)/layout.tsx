import React from 'react'
import { Geist, Manrope } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main  className={`${geistSans.variable} ${geistMono.variable} max-w-[1140px] mx-auto px-4 flex flex-col items-center justify-center gap-4 h-screen`}>
        { children }
    </main>
  )
}
