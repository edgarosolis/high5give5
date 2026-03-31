import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "High5Give5 — Give $5 to a Higher Cause",
  description:
    "From those who have to those who need. Join us feed the hungry and bring hope. $5 provides 50 meals in 22+ countries worldwide.",
  keywords: ["nonprofit", "charity", "feeding", "hunger", "donate", "High5Give5"],
  openGraph: {
    title: "High5Give5 — Give $5 to a Higher Cause",
    description: "$5 provides 50 meals. Join us in feeding the hungry and bringing hope to 22+ countries.",
    type: "website",
    url: "https://high5give5.org",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
