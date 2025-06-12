import type { Metadata } from "next";
import "./globals.css";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import { NextAuthProvider } from "@/lib/providers";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    <html lang="en" suppressHydrationWarning>
      <NextAuthProvider session={session}>
        <body
          className={`font-saira antialiased bg-primary flex flex-col min-h-screen`}
        >
          <Header />
          <main className="flex-1">
            {children}
            
          </main>
          <Footer />
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
          </body>
      </NextAuthProvider>
    </html>
  );
}
