import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Sidebar from "@/components/sidebar";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next JS Pragmatic Labs",
  description: "Learn and practice React 19 and Next.js canary features with real-world labs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Inline script to prevent theme flash before hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t){document.documentElement.setAttribute("data-theme",t)}else{document.documentElement.setAttribute("data-theme","dark")}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-250">
        <ThemeProvider defaultTheme="dark">
          <div className="flex min-h-screen flex-col lg:flex-row">
            {/* Sidebar Navigation */}
            <Suspense fallback={<div className="w-64 bg-card border-r border-border h-screen hidden lg:block" />}>
              <Sidebar />
            </Suspense>

            {/* Main Application Content Container */}
            <main className="flex-1 lg:pl-64 pt-14 lg:pt-0">
              <div className="mx-auto min-h-screen w-full max-w-6xl p-6 lg:p-10 flex flex-col">
                <Suspense
                  fallback={
                    <div className="flex flex-col gap-4 py-20 items-center justify-center text-muted-foreground text-xs font-semibold">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span>Loading lab workspace...</span>
                    </div>
                  }
                >
                  {children}
                </Suspense>
              </div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
