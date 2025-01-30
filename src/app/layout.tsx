import type { Metadata } from "next";
import { gilroy } from "@/lib/font";
import "./globals.css";


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
        {children}
      </body>
    </html>
  );
}