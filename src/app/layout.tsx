import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Exploring Frontend Development: Tips and Tricks",
  description: "Embark on a journey through the ever-evolving landscape of JavaScript, TypeScript, and a myriad of frontend technologies including React, Next.js, Redux, and advanced state management. Explore expert insights, cutting-edge techniques, and in-depth articles that elevate your development prowess and illuminate the path to frontend mastery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
