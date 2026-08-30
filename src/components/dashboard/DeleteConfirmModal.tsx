'use client';

import React, { useState } from 'react';
import { Category } from '../../types/category';
import { categoryService } from '../../services/category.service';
import { getApiErrorMessage } from '../../lib/utils';
import { AlertTriangle, Trash2, X, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category: Category | null;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onSuccess,
  category,
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !category) return null;

  const hasProducts = typeof category.productsCount === 'number' && category.productsCount > 0;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await categoryService.deleteCategory(category.id);
      toast.success(`Categoría "${category.name}" eliminada exitosamente`);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const errorMsg = getApiErrorMessage(
        err,
        'No se pudo eliminar la categoría'
      );
      toast.error(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in cursor-pointer"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 z-10 animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon */}
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 shadow-xs">
          <AlertTriangle className="w-6 h-6" />
        </div>

        {/* Content */}
        <h3 className="text-lg font-black text-slate-900 tracking-tight mb-1">
          ¿Eliminar la categoría &quot;{category.name}&quot;?
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-4">
          Esta acción no se puede deshacer.
        </p>

        {/* Informative Alert if category has products */}
        {hasProducts && (
          <div className="mb-6 p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start gap-2.5 text-amber-900 text-xs leading-relaxed">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold mb-0.5">
                No es posible eliminar esta categoría
              </strong>
              <span>
                Tiene <strong>{category.productsCount} productos asociados</strong>. Debes reasignar o eliminar los productos antes de poder eliminar la categoría.
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting || hasProducts}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/25 transition-all active:scale-98 cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Eliminando...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Eliminar Categoría</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
