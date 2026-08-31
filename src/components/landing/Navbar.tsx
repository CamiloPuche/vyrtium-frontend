'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Truck, ShieldCheck, Search } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface NavbarProps {
  onSearchChange?: (val: string) => void;
  searchValue?: string;
}

export function LandingNavbar({ onSearchChange, searchValue }: NavbarProps) {
  const { totalItems, openCart } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      {/* Top Announcement Bar */}
      <div className="bg-slate-900 text-slate-300 text-[10px] sm:text-[11px] py-1.5 px-3 sm:px-4 text-center font-medium flex items-center justify-center gap-2 sm:gap-4">
        <span className="flex items-center gap-1.5 truncate">
          <Truck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="truncate">Envíos a todo el país · Precios en COP</span>
        </span>
        <span className="hidden md:inline text-slate-600">|</span>
        <span className="hidden md:flex items-center gap-1.5 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Productos 100% Originales</span>
        </span>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <span className="text-base sm:text-xl font-black tracking-tight text-slate-900 block leading-tight">
              VYRTIUM
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-indigo-600 block">
              Shop
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
          <Link href="/" className="hover:text-indigo-600 transition-colors">
            Inicio
          </Link>
          <Link
            href="/catalogo"
            className="text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Catálogo
          </Link>
        </nav>

        {/* Search Bar Input & Cart Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {onSearchChange !== undefined && (
            <div className="relative w-36 sm:w-56 md:w-64">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchValue || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full pl-8 sm:pl-9 pr-2.5 sm:pr-3 py-1.5 bg-slate-100/80 rounded-full text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all border border-slate-200/60"
              />
            </div>
          )}

          {/* Cart Icon Button with Dynamic Badge */}
          <button
            onClick={openCart}
            className="relative p-2 text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer shrink-0"
            aria-label="Ver carrito"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 w-4.5 h-4.5 bg-indigo-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-scale-in">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
