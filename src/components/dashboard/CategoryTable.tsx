'use client';

import React from 'react';
import { Category } from '../../types/category';
import { Edit2, Trash2, Tag, Layers, PackageSearch } from 'lucide-react';

interface CategoryTableProps {
  categories: Category[];
  isLoading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryTable({
  categories,
  isLoading,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs animate-pulse">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="h-4 bg-slate-200 rounded-md w-32" />
        </div>
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-200 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded-md w-40" />
              </div>
              <div className="h-4 bg-slate-200 rounded-md w-24" />
              <div className="h-8 bg-slate-200 rounded-xl w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
          <PackageSearch className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">
          No hay categorías registradas
        </h3>
        <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
          Comienza creando tu primera categoría para organizar los productos de la tienda.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-6">Categoría</th>
              <th className="py-3.5 px-6">Productos Asociados</th>
              <th className="py-3.5 px-6">Fecha de Creación</th>
              <th className="py-3.5 px-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {categories.map((cat) => {
              const count = cat.productsCount ?? 0;
              const formattedDate = cat.createdAt
                ? new Date(cat.createdAt).toLocaleDateString('es-CO', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : '—';

              return (
                <tr
                  key={cat.id}
                  className="hover:bg-slate-50/60 transition-colors group"
                >
                  {/* Category Name */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/60">
                        <Tag className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-900 text-sm">
                        {cat.name}
                      </span>
                    </div>
                  </td>

                  {/* Associated Products Count */}
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        count > 0
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-100/60'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>
                        {count} {count === 1 ? 'producto' : 'productos'}
                      </span>
                    </span>
                  </td>

                  {/* Created Date */}
                  <td className="py-4 px-6 text-slate-500 font-medium">
                    {formattedDate}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onEdit(cat)}
                        className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all cursor-pointer"
                        title="Editar categoría"
                        aria-label={`Editar categoría ${cat.name}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDelete(cat)}
                        className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                        title="Eliminar categoría"
                        aria-label={`Eliminar categoría ${cat.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
