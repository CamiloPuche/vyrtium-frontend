"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { categoryService } from "../../services/category.service";
import { productService } from "../../services/product.service";
import { useAuth } from "../../context/AuthContext";
import { Tag, Package, Store, ArrowRight } from "lucide-react";

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [totalCategories, setTotalCategories] = useState<number | null>(null);
  const [totalProducts, setTotalProducts] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      try {
        const [categories, productsData] = await Promise.all([
          categoryService.getCategories(),
          productService.getProducts({ limit: 1 }),
        ]);

        if (isMounted) {
          setTotalCategories(categories.length);
          setTotalProducts(productsData.meta.total);
        }
      } catch {
        // Stats failed silently without breaking dashboard
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            ¡Hola, {user?.name || "Administrador"}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Bienvenido a la consola comercial.
          </p>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Gestiona categorías, catálogo de productos, inventario y enlaces
            comerciales de la plataforma.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Categories Card */}
        <Link
          href="/dashboard/categorias"
          className="group bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-indigo-300 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Tag className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Categorías Activas
            </span>
            <span className="text-3xl font-black text-slate-900 tracking-tight block">
              {isLoading ? "—" : (totalCategories ?? 0)}
            </span>
            <p className="text-xs text-slate-500 mt-2">
              Clasificaciones comerciales configuradas
            </p>
          </div>
        </Link>

        {/* Products Card */}
        <Link
          href="/dashboard/productos"
          className="group bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-indigo-300 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Package className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-violet-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Total de Productos
            </span>
            <span className="text-3xl font-black text-slate-900 tracking-tight block">
              {isLoading ? "—" : (totalProducts ?? 0)}
            </span>
            <p className="text-xs text-slate-500 mt-2">
              Ítems en inventario
            </p>
          </div>
        </Link>

        {/* Public Store Quick Link */}
        <Link
          href="/catalogo"
          target="_blank"
          className="group bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Store className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Tienda Pública
            </span>
            <span className="text-xl font-black text-slate-900 tracking-tight block">
              Ver Catálogo
            </span>
            <p className="text-xs text-slate-500 mt-2">
              Mira como se ve tu tienda pública
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
