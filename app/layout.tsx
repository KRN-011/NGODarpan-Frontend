import type { Metadata } from "next";
import "./globals.css";
import Header from "@/layout/Header";
import { NextAuthProvider } from "@/lib/providers";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { ThemeProvider } from "@/context/ThemeContext";
import CustomToastContainer from "@/components/CustomToastContainer";
import Script from "next/script";

export const metadata: Metadata = {
  title: "NGO Darpan",
  description: "NGO Darpan - A platform for public to donate, volunteer and verify NGOs",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getServerSession(authOptions);


  return (
    <html lang="en" className="h-full" suppressHydrationWarning>

      <body
        className={`preload font-saira antialiased bg-bg dark:bg-bg-dark dark:text-primary transition-all duration-300 flex flex-col h-full min-h-screen`}
      >
        <Script id="remove-preload" strategy="afterInteractive">
          {`
            if (document.readyState === 'loading') {
              window.addEventListener('DOMContentLoaded', function() {
                document.body.classList.remove('preload');
              });
            } else {
              document.body.classList.remove('preload');
            }
          `}
        </Script>
        <Script id="theme-loader" strategy="beforeInteractive">
          {`
                (function() {
                  try {
                    var theme = window.localStorage.getItem('theme') || document.cookie.split('; ').find(row => row.startsWith('theme='))?.split('=')[1];
                    if (theme) {
                      document.documentElement.setAttribute('data-theme', theme);
                      }
                      } catch(e) {}
                      })();
                      `}
        </Script>
        <NextAuthProvider session={session}>
          <ThemeProvider>
            <Header />
              <main className="p-3 flex-1">
                {children}
              </main>
            <CustomToastContainer />
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
