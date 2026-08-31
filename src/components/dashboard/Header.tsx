'use client';

import React from 'react';
import { Menu, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onToggleSidebar: () => void;
  title: string;
  subtitle?: string;
}

export function Header({ onToggleSidebar, title, subtitle }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-3 sm:gap-4">
      {/* Left: Mobile Hamburger & Page Title */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shrink-0"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 hidden sm:block truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Active Session Badge */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-2 bg-slate-100/80 border border-slate-200/60 py-1 px-2.5 sm:py-1.5 sm:px-3 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
          <span className="text-xs font-semibold text-slate-700 hidden sm:inline max-w-[120px] truncate">
            {user?.name || 'Administrador'}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
        </div>
      </div>
    </header>
  );
}
