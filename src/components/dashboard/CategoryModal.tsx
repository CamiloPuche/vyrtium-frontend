'use client';

import React, { useState } from 'react';
import { Category, CreateCategoryDTO, UpdateCategoryDTO } from '../../types/category';
import { categoryService } from '../../services/category.service';
import { getApiErrorMessage } from '../../lib/utils';
import { X, Tag, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categoryToEdit?: Category | null;
}

export function CategoryModal({
  isOpen,
  onClose,
  onSuccess,
  categoryToEdit,
}: CategoryModalProps) {
  const [name, setName] = useState(categoryToEdit?.name ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!categoryToEdit;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error('El nombre de la categoría es obligatorio');
      return;
    }

    try {
      setIsSubmitting(true);
      if (isEditing && categoryToEdit) {
        const payload: UpdateCategoryDTO = { name: trimmedName };
        await categoryService.updateCategory(categoryToEdit.id, payload);
        toast.success('Categoría actualizada exitosamente');
      } else {
        const payload: CreateCategoryDTO = { name: trimmedName };
        await categoryService.createCategory(payload);
        toast.success('Categoría creada exitosamente');
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const errorMsg = getApiErrorMessage(
        err,
        isEditing
          ? 'Error al actualizar la categoría'
          : 'Error al crear la categoría'
      );
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
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
      <div className="relative w-full max-w-md bg-white rounded-3xl p-5 sm:p-8 shadow-2xl border border-slate-100 z-10 animate-scale-in max-h-[90dvh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? 'Modifica el nombre de la categoría comercial'
                  : 'Registra una nueva categoría para organizar productos'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Nombre de la Categoría
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Suplementos Deportivos"
              autoFocus
              required
              className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/25 transition-all active:scale-98 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <span>{isEditing ? 'Guardar Cambios' : 'Crear Categoría'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
