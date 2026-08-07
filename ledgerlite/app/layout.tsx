import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "@/app/components/providers";
import { GoogleAnalytics } from "@next/third-parties/google";


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
    <html lang="en" className="h-full antialiased font-sans">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem('ledgerlite-theme') || 'light';
                const isDark = savedTheme === 'dark' || (savedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
        <Toaster position="bottom-right" />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
      </body>
    </html>
  );
}
