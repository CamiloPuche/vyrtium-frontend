'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Product, CreateProductDTO, UpdateProductDTO } from '../../types/product';
import { Category } from '../../types/category';
import { productService } from '../../services/product.service';
import { getApiErrorMessage } from '../../lib/utils';
import {
  X,
  UploadCloud,
  Package,
  DollarSign,
  Boxes,
  FileText,
  Tag,
  Image as ImageIcon,
  Loader2,
  Trash2,
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
  const isEditing = Boolean(productToEdit);

  // Form State
  const [name, setName] = useState<string>(productToEdit?.name || '');
  const [description, setDescription] = useState<string>(
    productToEdit?.description || ''
  );
  const [price, setPrice] = useState<string>(
    productToEdit?.price !== undefined ? String(productToEdit.price) : ''
  );
  const [stock, setStock] = useState<string>(
    productToEdit?.stock !== undefined ? String(productToEdit.stock) : '0'
  );
  const [categoryId, setCategoryId] = useState<string>(
    productToEdit?.categoryId || categories[0]?.id || ''
  );

  // Image Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    productToEdit?.imageUrl || null
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten archivos de imagen (JPEG, PNG, WebP, GIF)');
      return;
    }

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no puede exceder los 5MB');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
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
    if (parsedPrice > 99999999.99) {
      toast.error('El precio no puede exceder $99.999.999 COP');
      return;
    }
    if (isNaN(parsedStock) || parsedStock < 0) {
      toast.error('El stock no puede ser negativo');
      return;
    }
    if (parsedStock > 1000000) {
      toast.error('El stock no puede exceder 1.000.000 unidades');
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
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1: Product Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-slate-400" />
              <span>Nombre del Producto</span> <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Proteína Whey Isolate 2kg"
              required
              maxLength={255}
              className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Row 2: Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span>Categoría</span> <span className="text-rose-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
              >
                <option value="" disabled>
                  Selecciona una categoría
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
                max="99999999"
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
              max="1000000"
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
              maxLength={2000}
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
              <div className="relative w-full h-44 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center group">
                <Image
                  src={previewUrl}
                  alt="Vista previa del producto"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-2xs">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 bg-white text-slate-900 text-xs font-bold rounded-xl shadow-md hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    Cambiar Imagen
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-2 bg-rose-600 text-white rounded-xl shadow-md hover:bg-rose-700 transition-all cursor-pointer"
                    title="Eliminar imagen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileChange(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                  isDragOver
                    ? 'border-indigo-500 bg-indigo-50/50'
                    : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700">
                    Haz clic para subir o arrastra una imagen aquí
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    PNG, JPG, WebP o GIF (Máx. 5MB) · Se alojará en Cloudinary
                  </p>
                </div>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
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
                  <span>Guardando...</span>
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
