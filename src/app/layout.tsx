import type { Metadata } from "next";
import { gilroy } from "@/lib/font";
import "./globals.css";
import Header from "@/components/views/header";
import Footer from "@/components/views/footer";


export const metadata: Metadata = {
  title: "React Task",
  description: "React Task for UzInfoCom Frontend Developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={gilroy.className}
      >
        <Header />
        <main className="min-h-screen bg-white">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}