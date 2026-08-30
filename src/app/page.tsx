import Link from 'next/link';
import {
  ShoppingBag,
  ShieldCheck,
  ExternalLink,
  Code2,
  ArrowRight,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
              VYRTIUM
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Prueba Técnica
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium">
            <a
              href="http://localhost:4000/api/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span>Swagger API Docs</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>
            <Link
              href="/login"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-all shadow-sm"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-10 sm:py-16 flex-1 flex flex-col justify-center items-center text-center">
        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-balance leading-tight sm:leading-tight mb-4">
          Plataforma de E-commerce &{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            Gestión Comercial
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl text-balance mb-8 leading-relaxed">
          Solución integral con catálogo público de productos, panel administrativo privado, autenticación dual-token con rotación segura y notificaciones transaccionales vía Resend.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mb-10">
          <Link
            href="/catalogo"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explorar Catálogo Público</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-slate-800/90 hover:bg-slate-800 text-slate-200 hover:text-white text-sm font-semibold rounded-xl border border-slate-700/80 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Panel de Administración</span>
          </Link>
        </div>

        {/* Tech Stack Pills */}
        <div className="pt-6 border-t border-slate-800/80 w-full flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span className="font-semibold text-slate-500 mr-1">Stack:</span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-300">Next.js 16</span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-300">React 19</span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-300">TypeScript</span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-300">Tailwind CSS</span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-300">Node / Express</span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-300">PostgreSQL</span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-300">TypeORM</span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-300">Cloudinary</span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-300">Resend</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
        <p>© 2026 Vyrtium E-commerce · Diseñado y desarrollado por <strong className="text-slate-400">Camilo Puche</strong></p>
      </footer>
    </div>
  );
}
