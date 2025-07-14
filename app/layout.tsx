import type { Metadata } from "next";
import Provider from "@magicbell/react/context-provider";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import jwt from "jsonwebtoken";
import { loadEnvConfig } from "@next/env";

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
  loadEnvConfig(process.cwd());

  const secret = process.env.MAGICBELL_SECRET_KEY;
  const payload = {
    user_email: "niya@magicbell.io",
    user_external_id: "7f4baab5-0c91-44e8-8b58-5ff849535174",
    api_key: process.env.MAGICBELL_API_KEY,
  };

  if (secret === undefined) {
    console.error("Secret key is undefined.");
    return;
  }

  const token = jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn: "1y",
  });

  return (
    <Provider token={token}>
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
