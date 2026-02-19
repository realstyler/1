import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";
import QCProvider from "@/components/providers/QueryClient";
import { UserDTO } from "@/auth/auth.dto";
import InitUserState from "@/components/providers/InitUserState";
import { meServer } from "./actions/auth";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "RealStyler - AI Interior Design",
  description:
    "Transform your space with AI-powered interior design. Upload a photo and watch the magic happen.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user: UserDTO | null | undefined = undefined;

  try {
    user = await meServer();
  } catch {}

  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfairDisplay.variable} font-sans antialiased bg-white text-neutral-900`}
      >
        <InitUserState user={user ?? null}>
          <QCProvider>
            <Navbar />
            {children}
          </QCProvider>
        </InitUserState>
      </body>
    </html>
  );
}
