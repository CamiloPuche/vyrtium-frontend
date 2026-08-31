'use client';

import React from 'react';
import { Category } from '../../types/category';
import { Layers } from 'lucide-react';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  isLoading?: boolean;
}

export function CategoryFilter({
  categories,
  selectedCategoryId,
  onSelectCategory,
  isLoading,
}: CategoryFilterProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 overflow-x-auto py-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-9 w-28 bg-slate-200 rounded-full shrink-0"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 overflow-x-auto py-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
        {/* "Todos" pill */}
        <button
          onClick={() => onSelectCategory('')}
          className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            selectedCategoryId === ''
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
              : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Todos</span>
        </button>

        {/* Category Pills */}
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span>{cat.name}</span>
              {typeof cat.productsCount === 'number' && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {cat.productsCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
