import type { Metadata } from "next";
import './layout.css'

export const metadata: Metadata = {
  title: "spybee",
  description: "Aplicacion para prueba tecnicade la empresa spybee",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
