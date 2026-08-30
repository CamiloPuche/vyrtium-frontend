'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '../../types/product';
import { productService } from '../../services/product.service';
import { formatCOP, getApiErrorMessage } from '../../lib/utils';
import {
  X,
  Package,
  Tag,
  DollarSign,
  Boxes,
  Calendar,
  Layers,
  Edit2,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string | null;
  onEdit: (product: Product) => void;
}

export function ProductDetailModal({
  isOpen,
  onClose,
  productId,
  onEdit,
}: ProductDetailModalProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen || !productId) return;

    let isMounted = true;
    const loadDetail = async () => {
      try {
        setIsLoading(true);
        const data = await productService.getProductById(productId);
        if (isMounted) {
          setProduct(data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const errorMsg = getApiErrorMessage(
            err,
            'Error al cargar el detalle del producto'
          );
          toast.error(errorMsg);
          onClose();
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDetail();

    return () => {
      isMounted = false;
    };
  }, [isOpen, productId, onClose]);

  if (!isOpen) return null;

  const handleCopyId = () => {
    if (!product?.id) return;
    navigator.clipboard.writeText(product.id);
    setCopied(true);
    toast.success('UUID copiado al portapapeles');
    setTimeout(() => setCopied(false), 2000);
  };

  const inStock = product ? product.stock > 0 : false;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in cursor-pointer"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 z-10 animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-xs font-bold text-slate-500">
              Cargando información del producto...
            </p>
          </div>
        ) : product ? (
          <div className="space-y-6">
            {/* Header / Title */}
            <div className="pr-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100/60 px-2.5 py-0.5 rounded-full">
                  <Tag className="w-3 h-3" />
                  <span>{product.category?.name || 'Sin Categoría'}</span>
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    inStock
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                      : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>
                    {inStock ? `${product.stock} en inventario` : 'Agotado'}
                  </span>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {product.name}
              </h2>
            </div>

            {/* Media Showcase */}
            <div className="relative w-full h-56 sm:h-64 rounded-2xl bg-slate-100 border border-slate-200/80 overflow-hidden flex items-center justify-center">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 600px"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                  <Package className="w-12 h-12 stroke-[1.2]" />
                  <span className="text-xs font-medium">
                    Sin imagen registrada
                  </span>
                </div>
              )}
            </div>

            {/* Price & Commercial Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Price Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                  <DollarSign className="w-3 h-3 text-slate-400" />
                  <span>Precio de Venta</span>
                </span>
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  {formatCOP(product.price)}
                </span>
              </div>

              {/* Stock Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                  <Boxes className="w-3 h-3 text-slate-400" />
                  <span>Disponibilidad en Stock</span>
                </span>
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  {product.stock}{' '}
                  <span className="text-xs font-semibold text-slate-500">
                    unidades
                  </span>
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Descripción Comercial
              </span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed p-4 rounded-2xl bg-slate-50 border border-slate-200/70 whitespace-pre-line">
                {product.description || 'Sin descripción comercial registrada.'}
              </p>
            </div>

            {/* System Metadata */}
            <div className="p-3.5 rounded-2xl bg-slate-100/70 border border-slate-200/60 text-xs text-slate-500 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-600">ID (UUID):</span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="inline-flex items-center gap-1 font-mono text-[11px] bg-white px-2 py-0.5 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors text-slate-700 cursor-pointer"
                  title="Copiar UUID"
                >
                  <span className="truncate max-w-[200px] sm:max-w-none">
                    {product.id}
                  </span>
                  {copied ? (
                    <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                  ) : (
                    <Copy className="w-3 h-3 text-slate-400 shrink-0" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>Fecha de Registro:</span>
                </span>
                <span className="font-medium text-slate-700">
                  {product.createdAt
                    ? new Date(product.createdAt).toLocaleString('es-CO', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '—'}
                </span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
              >
                Cerrar
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(product);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/25 transition-all active:scale-98 cursor-pointer"
              >
                <Edit2 className="w-4 h-4" />
                <span>Editar Producto</span>
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
