import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";
import { Pixelify_Sans } from "next/font/google";

export const metadata: Metadata = {
  title: "Goorka Games",
  description: "A platform for sharing and discovering pixel-style games",
};

const font = Pixelify_Sans({ weight: ["400"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.className} bg-stone-950 text-stone-200 antialiased`}>
          <Header />
          {children}
      </body>
    </html>
  );
}
