'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Product, CreateProductDTO, UpdateProductDTO } from '../../types/product';
import { Category } from '../../types/category';
import { productService } from '../../services/product.service';
import { getApiErrorMessage } from '../../lib/utils';
import {
  X,
  Package,
  UploadCloud,
  Image as ImageIcon,
  Loader2,
  DollarSign,
  Boxes,
  Tag,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productToEdit?: Product | null;
  categories: Category[];
}

export function ProductModal({
  isOpen,
  onClose,
  onSuccess,
  productToEdit,
  categories,
}: ProductModalProps) {
  const isEditing = !!productToEdit;

  // Form State
  const [name, setName] = useState(productToEdit?.name ?? '');
  const [categoryId, setCategoryId] = useState(
    productToEdit?.categoryId ?? (categories[0]?.id || '')
  );
  const [price, setPrice] = useState<string>(
    productToEdit?.price !== undefined ? productToEdit.price.toString() : ''
  );
  const [stock, setStock] = useState<string>(
    productToEdit?.stock !== undefined ? productToEdit.stock.toString() : '0'
  );
  const [description, setDescription] = useState(
    productToEdit?.description ?? ''
  );

  // Image Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    productToEdit?.imageUrl ?? null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen no debe superar los 5MB');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock, 10);

    // Validations
    if (!trimmedName) {
      toast.error('El nombre del producto es obligatorio');
      return;
    }
    if (!categoryId) {
      toast.error('Debes seleccionar una categoría');
      return;
    }
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      toast.error('El precio debe ser un número mayor a 0');
      return;
    }
    if (isNaN(parsedStock) || parsedStock < 0) {
      toast.error('El stock no puede ser negativo');
      return;
    }

    try {
      setIsSubmitting(true);

      if (isEditing && productToEdit) {
        const payload: UpdateProductDTO = {
          name: trimmedName,
          description: description.trim(),
          price: parsedPrice,
          stock: parsedStock,
          categoryId,
          ...(selectedFile ? { image: selectedFile } : {}),
        };
        await productService.updateProduct(productToEdit.id, payload);
        toast.success('Producto actualizado exitosamente');
      } else {
        const payload: CreateProductDTO = {
          name: trimmedName,
          description: description.trim(),
          price: parsedPrice,
          stock: parsedStock,
          categoryId,
          ...(selectedFile ? { image: selectedFile } : {}),
        };
        await productService.createProduct(payload);
        toast.success('Producto creado exitosamente');
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const errorMsg = getApiErrorMessage(
        err,
        isEditing
          ? 'Error al actualizar el producto'
          : 'Error al crear el producto'
      );
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in cursor-pointer"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 z-10 animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? 'Modifica las especificaciones, precio o imagen del producto'
                  : 'Registra un nuevo producto en el catálogo comercial'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Nombre del Producto <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Proteína Whey Isolate 2kg"
              required
              className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Row 2: Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span>Categoría</span> <span className="text-rose-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              >
                <option value="" disabled>
                  Selecciona una categoría...
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price (COP) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                <span>Precio (COP)</span> <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                onWheel={(e) => (e.target as HTMLElement).blur()}
                placeholder="Ej. 185000"
                min="1"
                step="any"
                required
                className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          {/* Row 3: Stock */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Boxes className="w-3.5 h-3.5 text-slate-400" />
              <span>Inventario / Stock Disponible</span>{' '}
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              onWheel={(e) => (e.target as HTMLElement).blur()}
              placeholder="Ej. 50"
              min="0"
              step="1"
              required
              className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          {/* Row 4: Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Descripción Comercial</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalla las características, beneficios o modo de uso del producto..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Row 5: Cloudinary Image Dropzone */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>Imagen del Producto</span>
            </label>

            {previewUrl ? (
              <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center group">
                <Image
                  src={previewUrl}
                  alt="Vista previa"
                  fill
                  className="object-contain p-2"
                  unoptimized={previewUrl.startsWith('blob:')}
                />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white text-slate-900 text-xs font-bold rounded-lg shadow-md hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    Cambiar Imagen
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg shadow-md hover:bg-rose-700 transition-all cursor-pointer"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-36 rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/40 transition-colors flex flex-col items-center justify-center p-4 cursor-pointer text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2 transition-colors">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                  Haz clic o arrastra un archivo de imagen
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Formatos permitidos: PNG, JPG, WEBP (máx. 5MB)
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/jpg"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
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
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/25 transition-all active:scale-98 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Subiendo y guardando...</span>
                </>
              ) : (
                <span>{isEditing ? 'Guardar Cambios' : 'Crear Producto'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
