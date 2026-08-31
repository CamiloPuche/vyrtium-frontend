'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '../../types/product';
import { formatCOP } from '../../lib/utils';
import { Edit2, Trash2, Package, Tag, Layers, PackageSearch, Eye } from 'lucide-react';

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onOpenCreate: () => void;
  onViewDetail: (product: Product) => void;
}

export function ProductTable({
  products,
  isLoading,
  onEdit,
  onDelete,
  onOpenCreate,
  onViewDetail,
}: ProductTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs animate-pulse">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="h-4 bg-slate-200 rounded-md w-32" />
        </div>
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                <div className="space-y-1.5">
                  <div className="h-4 bg-slate-200 rounded-md w-48" />
                  <div className="h-3 bg-slate-100 rounded-md w-32" />
                </div>
              </div>
              <div className="h-4 bg-slate-200 rounded-md w-24" />
              <div className="h-4 bg-slate-200 rounded-md w-20" />
              <div className="h-8 bg-slate-200 rounded-xl w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 text-center shadow-xs flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
          <PackageSearch className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">
          No se encontraron productos
        </h3>
        <p className="text-xs text-slate-500 max-w-xs leading-relaxed mb-4">
          Ajusta los filtros de búsqueda o registra tu primer producto en el catálogo.
        </p>
        <button
          onClick={onOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/25 transition-all active:scale-98 cursor-pointer"
        >
          <Package className="w-4 h-4" />
          <span>Crear Primer Producto</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* ================= MOBILE CARD LIST VIEW (<md) ================= */}
      <div className="md:hidden space-y-3">
        {products.map((prod) => {
          const inStock = prod.stock > 0;

          return (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3"
            >
              {/* Card Header: Image + Name + Category */}
              <div className="flex items-start gap-3">
                <div
                  onClick={() => onViewDetail(prod)}
                  className="relative w-14 h-14 rounded-xl bg-slate-100 border border-slate-200/70 overflow-hidden shrink-0 flex items-center justify-center cursor-pointer"
                >
                  {prod.imageUrl ? (
                    <Image
                      src={prod.imageUrl}
                      alt={prod.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : (
                    <Package className="w-6 h-6 text-slate-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <span
                    onClick={() => onViewDetail(prod)}
                    className="font-bold text-slate-900 text-sm block truncate cursor-pointer hover:text-indigo-600 transition-colors"
                  >
                    {prod.name}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/60 truncate max-w-[150px]">
                      <Tag className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                      <span className="truncate">{prod.category?.name || 'Sin categoría'}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Stock Row */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Precio
                  </span>
                  <span className="font-black text-slate-900 text-sm">
                    {formatCOP(prod.price)}
                  </span>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    inStock
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                      : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>{inStock ? `${prod.stock} disp.` : 'Agotado'}</span>
                </span>
              </div>

              {/* Action Buttons Footer */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => onViewDetail(prod)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 text-xs font-semibold rounded-xl border border-slate-200/70 transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Detalle</span>
                </button>

                <button
                  onClick={() => onEdit(prod)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 text-xs font-semibold rounded-xl border border-slate-200/70 transition-all cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>

                <button
                  onClick={() => onDelete(prod)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200/60 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= DESKTOP TABLE VIEW (>=md) ================= */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-6">Producto</th>
                <th className="py-3.5 px-6">Categoría</th>
                <th className="py-3.5 px-6">Precio</th>
                <th className="py-3.5 px-6">Inventario</th>
                <th className="py-3.5 px-6">Fecha</th>
                <th className="py-3.5 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {products.map((prod) => {
                const inStock = prod.stock > 0;
                const formattedDate = prod.createdAt
                  ? new Date(prod.createdAt).toLocaleDateString('es-CO', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                  : '—';

                return (
                  <tr
                    key={prod.id}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    {/* Product Thumbnail & Name */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5 min-w-[220px]">
                        <div
                          onClick={() => onViewDetail(prod)}
                          className="relative w-11 h-11 rounded-xl bg-slate-100 border border-slate-200/70 overflow-hidden shrink-0 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-indigo-500/30 transition-all"
                          title="Ver detalle"
                        >
                          {prod.imageUrl ? (
                            <Image
                              src={prod.imageUrl}
                              alt={prod.name}
                              fill
                              className="object-cover"
                              sizes="44px"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span
                            onClick={() => onViewDetail(prod)}
                            className="font-bold text-slate-900 text-sm block truncate group-hover:text-indigo-600 transition-colors cursor-pointer"
                          >
                            {prod.name}
                          </span>
                          {prod.description && (
                            <span className="text-[11px] text-slate-500 block truncate max-w-xs">
                              {prod.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
                        <Tag className="w-3 h-3 text-slate-400" />
                        <span>{prod.category?.name || 'Sin categoría'}</span>
                      </span>
                    </td>

                    {/* Price in COP */}
                    <td className="py-4 px-6">
                      <span className="font-black text-slate-900 text-sm">
                        {formatCOP(prod.price)}
                      </span>
                    </td>

                    {/* Stock Availability */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          inStock
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                        }`}
                      >
                        <Layers className="w-3 h-3" />
                        <span>
                          {inStock ? `${prod.stock} disponibles` : 'Agotado'}
                        </span>
                      </span>
                    </td>

                    {/* Created Date */}
                    <td className="py-4 px-6 text-slate-500 font-medium whitespace-nowrap">
                      {formattedDate}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewDetail(prod)}
                          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all cursor-pointer"
                          title="Ver detalle del producto"
                          aria-label={`Ver detalle de ${prod.name}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onEdit(prod)}
                          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all cursor-pointer"
                          title="Editar producto"
                          aria-label={`Editar producto ${prod.name}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onDelete(prod)}
                          className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                          title="Eliminar producto"
                          aria-label={`Eliminar producto ${prod.name}`}
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
    </div>
  );
}
