import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Vyrtium E-commerce | Plataforma de Catálogo & Gestión Comercial",
  description:
    "Catálogo comercial moderno y panel de administración para gestión de productos, inventario y categorías.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900">
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          theme="light"
          toastOptions={{
            duration: 4000,
          }}
        />
      </body>
    </html>
  );
}
