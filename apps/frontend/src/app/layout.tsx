import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "My DApp",
  description: "Polygon Amoy DApp",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href={"/logo.png"} type="image/x-icon"></link>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
