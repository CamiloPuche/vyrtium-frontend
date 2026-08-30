'use client';

import React from 'react';
import { Product } from '../../types/product';
import { ProductCard } from './ProductCard';
import { PackageSearch, RotateCcw } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  onResetFilters?: () => void;
}

export function ProductGrid({
  products,
  isLoading,
  onResetFilters,
}: ProductGridProps) {
  // Skeleton Loading Grid
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs"
          >
            <div className="aspect-4/3 bg-slate-200" />
            <div className="p-5 flex flex-col gap-3">
              <div className="h-4 bg-slate-200 rounded-md w-3/4" />
              <div className="h-3 bg-slate-200 rounded-md w-full" />
              <div className="h-3 bg-slate-200 rounded-md w-2/3" />
              <div className="mt-2 pt-3 border-t border-slate-100 flex justify-between items-center">
                <div className="h-5 bg-slate-200 rounded-md w-24" />
                <div className="h-5 bg-slate-200 rounded-md w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty State
  if (products.length === 0) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
          <PackageSearch className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          No se encontraron productos
        </h3>
        <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
          No encontramos ningún producto que coincida con tus criterios de búsqueda o filtros seleccionados.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restablecer Filtros</span>
          </button>
        )}
      </div>
    );
  }

  // Product Grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
