'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Category } from '../../../types/category';
import { categoryService } from '../../../services/category.service';
import { CategoryTable } from '../../../components/dashboard/CategoryTable';
import { CategoryModal } from '../../../components/dashboard/CategoryModal';
import { DeleteConfirmModal } from '../../../components/dashboard/DeleteConfirmModal';
import { getApiErrorMessage } from '../../../lib/utils';
import { Plus, Search, Tag, X } from 'lucide-react';
import { toast } from 'sonner';

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const fetchCategories = useCallback(async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err: unknown) {
      const errorMsg = getApiErrorMessage(
        err,
        'Error al cargar la lista de categorías'
      );
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadInitialCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        if (isMounted) {
          setCategories(data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          toast.error(getApiErrorMessage(err, 'Error al cargar la lista de categorías'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadInitialCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  // Client-side search filtering
  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const term = search.toLowerCase();
    return categories.filter((cat) => cat.name.toLowerCase().includes(term));
  }, [categories, search]);

  const handleOpenCreate = () => {
    setCategoryToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setCategoryToEdit(category);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Tag className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Gestión de Categorías
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Administra las clasificaciones de productos para el catálogo y control de inventario.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-indigo-600/25 transition-all active:scale-98 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Categoría</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar categoría por nombre..."
            className="w-full pl-10 pr-10 py-2.5 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {!isLoading && (
          <span className="text-xs font-bold text-slate-500 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs hidden sm:inline-block">
            {filteredCategories.length}{' '}
            {filteredCategories.length === 1 ? 'categoría' : 'categorías'}
          </span>
        )}
      </div>

      {/* Category Table */}
      <CategoryTable
        categories={filteredCategories}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Create / Edit Modal (keyed to remount with clean state) */}
      {isModalOpen && (
        <CategoryModal
          key={categoryToEdit?.id ?? 'new-category'}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => fetchCategories(false)}
          categoryToEdit={categoryToEdit}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <DeleteConfirmModal
          key={categoryToDelete?.id ?? 'delete-category'}
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setCategoryToDelete(null);
          }}
          onSuccess={() => fetchCategories(false)}
          category={categoryToDelete}
        />
      )}
    </div>
  );
}
