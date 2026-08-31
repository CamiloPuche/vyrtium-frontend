'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Product, ProductFilterParams } from '../../../types/product';
import { Category } from '../../../types/category';
import { productService } from '../../../services/product.service';
import { categoryService } from '../../../services/category.service';
import { ProductTable } from '../../../components/dashboard/ProductTable';
import { ProductModal } from '../../../components/dashboard/ProductModal';
import { ProductDetailModal } from '../../../components/dashboard/ProductDetailModal';
import { DeleteProductModal } from '../../../components/dashboard/DeleteProductModal';
import { Pagination } from '../../../components/landing/Pagination';
import { getApiErrorMessage } from '../../../lib/utils';
import {
  Plus,
  Search,
  Package,
  X,
  Filter,
  ArrowUpDown,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter & Pagination State
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('createdAt-DESC');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Create / Edit Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  // View Detail Modal state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [selectedProductIdForDetail, setSelectedProductIdForDetail] = useState<string | null>(null);

  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Debounce search input
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [search]);

  // Load Categories on mount
  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        if (isMounted) setCategories(data);
      } catch {
        // Fallback silently if categories fail
      }
    };
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch Products handler for manual triggers (create/edit/delete)
  const fetchProducts = useCallback(async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    try {
      const [sortByField, sortOrderField] = sortOption.split('-') as [
        ProductFilterParams['sortBy'],
        ProductFilterParams['sortOrder'],
      ];

      const params: ProductFilterParams = {
        page,
        limit: 10,
        sortBy: sortByField || 'createdAt',
        sortOrder: sortOrderField || 'DESC',
      };

      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }
      if (selectedCategory) {
        params.categoryId = selectedCategory;
      }

      const result = await productService.getProducts(params);
      setProducts(result.items);
      setTotalPages(result.meta.totalPages || 1);
      setTotalCount(result.meta.total || 0);
    } catch (err: unknown) {
      const errorMsg = getApiErrorMessage(
        err,
        'Error al cargar el catálogo de productos'
      );
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch, selectedCategory, sortOption]);

  // Reactive data fetching when filters change
  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const [sortByField, sortOrderField] = sortOption.split('-') as [
          ProductFilterParams['sortBy'],
          ProductFilterParams['sortOrder'],
        ];

        const params: ProductFilterParams = {
          page,
          limit: 10,
          sortBy: sortByField || 'createdAt',
          sortOrder: sortOrderField || 'DESC',
        };

        if (debouncedSearch.trim()) {
          params.search = debouncedSearch.trim();
        }
        if (selectedCategory) {
          params.categoryId = selectedCategory;
        }

        const result = await productService.getProducts(params);
        if (isMounted) {
          setProducts(result.items);
          setTotalPages(result.meta.totalPages || 1);
          setTotalCount(result.meta.total || 0);
        }
      } catch (err: unknown) {
        if (isMounted) {
          toast.error(
            getApiErrorMessage(err, 'Error al cargar el catálogo de productos')
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [page, debouncedSearch, selectedCategory, sortOption]);

  const handleOpenCreate = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleOpenDetail = (product: Product) => {
    setSelectedProductIdForDetail(product.id);
    setIsDetailModalOpen(true);
  };

  const handleOpenDelete = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Gestión de Productos
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Administra el catálogo comercial, inventario, precios e imágenes en Cloudinary.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-indigo-600/25 transition-all active:scale-98 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* Filter / Search Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Search Bar */}
        <div className="relative lg:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o descripción..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
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

        {/* Category Filter Dropdown */}
        <div className="relative">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-8 py-2.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-8 py-2.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
          >
            <option value="createdAt-DESC">Más recientes</option>
            <option value="price-ASC">Precio: menor a mayor</option>
            <option value="price-DESC">Precio: mayor a menor</option>
            <option value="stock-DESC">Mayor inventario</option>
            <option value="name-ASC">Nombre (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Results Counter */}
      {!isLoading && (
        <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
          <span>
            Mostrando {products.length} de {totalCount}{' '}
            {totalCount === 1 ? 'producto' : 'productos'}
          </span>
        </div>
      )}

      {/* Products Table */}
      <ProductTable
        products={products}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onOpenCreate={handleOpenCreate}
        onViewDetail={handleOpenDetail}
      />

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="pt-2">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}

      {/* Product Detail Modal */}
      {isDetailModalOpen && (
        <ProductDetailModal
          isOpen={isDetailModalOpen}
          productId={selectedProductIdForDetail}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedProductIdForDetail(null);
          }}
          onEdit={(product) => {
            setIsDetailModalOpen(false);
            handleOpenEdit(product);
          }}
        />
      )}

      {/* Create / Edit Modal (Keyed for fresh state remount) */}
      {isModalOpen && (
        <ProductModal
          key={productToEdit?.id ?? 'new-product'}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => fetchProducts(false)}
          productToEdit={productToEdit}
          categories={categories}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <DeleteProductModal
          key={productToDelete?.id ?? 'delete-product'}
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
          }}
          onSuccess={() => fetchProducts(false)}
          product={productToDelete}
        />
      )}
    </div>
  );
}
