import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import { Appbar } from "./component/Appbar";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};
const Inter = Poppins({ weight: "400", subsets: ["latin"], display: "swap" });
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body className={`${Inter.className} antialiased`}>
          <Toaster position="top-right" />
          <div className="h-screen">
            <Appbar />
            {children}
          </div>
        </body>
      </Providers>
    </html>
  );
}
