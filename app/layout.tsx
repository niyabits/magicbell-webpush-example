import type { Metadata } from "next";
import Provider from "@magicbell/react/context-provider";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Web Push Notifications React | MagicBell",
  description: "Web Push Notifications React Demo using MagicBell",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let token = null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:3000"}/user`
    );
    if (response.ok) {
      token = await response.json();
    }
  } catch (error) {
    console.error("Failed to fetch user token:", error);
  }

  return (
    <Provider token={token ? JSON.parse(token) : null}>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </Provider>
  );
}
