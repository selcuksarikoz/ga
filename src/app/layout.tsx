import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import clsx from "clsx";
import { TRPCReactProvider } from "@/trpc/react";
import { ModalProvider } from "@/components/modal-provider";
import { ModalRenderer } from "./components/modal-renderer";

export const metadata: Metadata = {
  title: "Game App",
  description: "Game App built with Next.js, tRPC, and Prisma",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={clsx("dark", geist.variable)}>
      <body>
        <TRPCReactProvider>
          <ModalProvider>
            {children}
            <ModalRenderer />
          </ModalProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
