import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-headline",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kinetic Terminal | GitHub Profile Visualizer",
  description:
    "Visualizing the human side of source code. Analyze stats, view history, see trends. Transform GitHub data into a curated narrative of technical expertise.",
};

import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#a1faff',
          colorBackground: '#060e20',
          colorInputBackground: '#010514',
          colorInputText: '#d8e1fa',
        }
      }}
    >
      <html lang="en" className="dark">
        <head>
          <link
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className={`${spaceGrotesk.variable} ${inter.variable}`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
