'use client';

import React, { useState } from 'react';
import { Product } from '../../types/product';
import { formatCOP } from '../../lib/utils';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Check, Package, Tag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Product Image Container */}
      <div className="relative aspect-4/3 w-full bg-slate-100/80 overflow-hidden flex items-center justify-center">
        {product.imageUrl && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 gap-2 p-6">
            <Package className="w-12 h-12 stroke-[1.2]" />
            <span className="text-xs font-medium">Imagen no disponible</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1 p-5">
        {/* Title */}
        <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed flex-1">
          {product.description || 'Producto de alta calidad.'}
        </p>

        {/* Category & Stock Indicators (Below Description) */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
          {/* Category */}
          {product.category ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50/80 px-2 py-0.5 rounded-md truncate max-w-[140px]">
              <Tag className="w-3 h-3 shrink-0" />
              <span className="truncate">{product.category.name}</span>
            </span>
          ) : (
            <span className="text-slate-400 text-[11px]">General</span>
          )}

          {/* Stock Status */}
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <span>Agotado</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>{product.stock} disponibles</span>
            </span>
          )}
        </div>

        {/* Price & Add to Cart (Bottom) */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 block">
              Precio
            </span>
            <span className="text-lg font-black text-slate-900 tracking-tight">
              {formatCOP(product.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-indigo-600 text-white hover:shadow-md hover:shadow-indigo-600/20 active:scale-95 cursor-pointer'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Añadido</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Comprar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
