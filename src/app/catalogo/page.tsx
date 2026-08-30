'use client';

import React, { useState, useEffect } from 'react';
import { LandingNavbar } from '../../components/landing/Navbar';
import { CategoryFilter } from '../../components/landing/CategoryFilter';
import { ProductGrid } from '../../components/landing/ProductGrid';
import { Pagination } from '../../components/landing/Pagination';
import { productService } from '../../services/product.service';
import { Product } from '../../types/product';
import { Category } from '../../types/category';
import { PaginationMeta } from '../../types/api';
import { SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';

type SortOption = 'recent' | 'price_asc' | 'price_desc' | 'name_asc';

export default function CatalogoPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 8,
    totalPages: 1,
  });

  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [sortByOption, setSortByOption] = useState<SortOption>('recent');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);

  // Debounce search input (300ms) without mutating loading state on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Discover active categories from the public catalog
  useEffect(() => {
    let isMounted = true;

    const discoverPublicCategories = async () => {
      try {
        const response = await productService.getPublicProducts({ limit: 100 });
        if (isMounted) {
          const categoryMap = new Map<string, Category>();
          response.items.forEach((p) => {
            if (p.category && !categoryMap.has(p.category.id)) {
              categoryMap.set(p.category.id, {
                id: p.category.id,
                name: p.category.name,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
              });
            }
          });
          setCategories(Array.from(categoryMap.values()));
        }
      } catch {
        // Fallback: keep empty array if catalog discovery fails
      } finally {
        if (isMounted) {
          setIsLoadingCategories(false);
        }
      }
    };

    discoverPublicCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch Public Products on filter/page/search change
  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setIsLoadingProducts(true);
      try {
        let sortBy: 'createdAt' | 'price' | 'name' = 'createdAt';
        let sortOrder: 'ASC' | 'DESC' = 'DESC';

        if (sortByOption === 'price_asc') {
          sortBy = 'price';
          sortOrder = 'ASC';
        } else if (sortByOption === 'price_desc') {
          sortBy = 'price';
          sortOrder = 'DESC';
        } else if (sortByOption === 'name_asc') {
          sortBy = 'name';
          sortOrder = 'ASC';
        }

        const categoryFilter =
          selectedCategoryId && selectedCategoryId.trim() !== ''
            ? selectedCategoryId.trim()
            : undefined;

        const response = await productService.getPublicProducts({
          page: currentPage,
          limit: 8,
          search: debouncedSearch.trim() || undefined,
          categoryId: categoryFilter,
          sortBy,
          sortOrder,
        });

        if (isMounted) {
          setProducts(response.items);
          setPaginationMeta(response.meta);
        }
      } catch {
        if (isMounted) {
          toast.error('Error al consultar los productos de la tienda');
        }
      } finally {
        if (isMounted) {
          setIsLoadingProducts(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [currentPage, debouncedSearch, selectedCategoryId, sortByOption]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1);
  };

  const handleSortChange = (option: SortOption) => {
    setSortByOption(option);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setSelectedCategoryId('');
    setSortByOption('recent');
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Header Navigation with integrated search */}
      <LandingNavbar
        searchValue={search}
        onSearchChange={handleSearchChange}
      />

      {/* Main Store Catalog Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Controls Bar: Category Pills & Sort Dropdown */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          {/* Category Filter Pills */}
          <div className="w-full md:flex-1">
            <CategoryFilter
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={handleCategorySelect}
              isLoading={isLoadingCategories}
            />
          </div>

          {/* Sort Dropdown & Total Results Count */}
          <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
            {!isLoadingProducts && (
              <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs">
                {paginationMeta?.total ?? 0} {paginationMeta?.total === 1 ? 'producto' : 'productos'}
              </span>
            )}

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={sortByOption}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs cursor-pointer"
              >
                <option value="recent">Más recientes</option>
                <option value="price_asc">Precio: Menor a Mayor</option>
                <option value="price_desc">Precio: Mayor a Menor</option>
                <option value="name_asc">Nombre: A - Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <ProductGrid
          products={products}
          isLoading={isLoadingProducts}
          onResetFilters={handleResetFilters}
        />

        {/* Pagination Bar */}
        <Pagination
          page={paginationMeta.page}
          totalPages={paginationMeta.totalPages}
          onPageChange={handlePageChange}
        />
      </main>

      {/* E-Commerce Store Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 tracking-tight">VYRTIUM</span>
            <span>· Tienda Online</span>
          </div>
          <p>© 2026 Vyrtium E-commerce. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
