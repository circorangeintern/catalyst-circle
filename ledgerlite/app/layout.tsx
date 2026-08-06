import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "@/app/components/providers";

export const metadata: Metadata = {
  title: "LedgerLite",
  description: "Record sales, track expenses, manage inventory and stay on top of your business with ease.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html
      lang="en"
      className="h-full antialiased font-sans"
    >
      <body className="min-h-full flex flex-col">
          <Providers>
            {children}
          </Providers>
          <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
