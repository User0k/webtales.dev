import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';

export const metadata: Metadata = {
  title: 'Exploring Frontend Development: Tips and Tricks',
  description:
    'Embark on a journey through the ever-evolving landscape of JavaScript, TypeScript, and a myriad of frontend technologies including React, Next.js, Redux, and advanced state management. Explore expert insights, cutting-edge techniques, and in-depth articles that elevate your development prowess and illuminate the path to frontend mastery.',
  keywords:
    'frontend, web, web-development, software, javascript, typescript, react',
  openGraph: {
    title: 'Exploring Frontend Development: Tips and Tricks',
    description: `Discover the evolving world of JavaScript, TypeScript, React, Next.js, Redux, and more. Gain expert insights, advanced techniques, and articles to enhance your frontend development skills.`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
      <GoogleAnalytics gaId="G-PNZXPNESPL" />
    </html>
  );
}
