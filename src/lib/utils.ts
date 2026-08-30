import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage = 'Ocurrió un error inesperado'
): string {
  if (!error) return fallbackMessage;

  const axiosError = error as {
    response?: {
      data?: {
        error?: string;
        message?: string;
        details?: Array<{ field?: string; message: string }>;
      };
    };
    message?: string;
  };

  const responseData = axiosError.response?.data;

  if (responseData?.error && typeof responseData.error === 'string') {
    return responseData.error;
  }

  if (responseData?.message && typeof responseData.message === 'string') {
    return responseData.message;
  }

  if (responseData?.details && responseData.details.length > 0) {
    return responseData.details.map((d) => d.message).join(', ');
  }

  if (axiosError.message && !axiosError.response) {
    return 'Error de conexión con el servidor. Verifica que el backend esté en ejecución.';
  }

  return fallbackMessage;
}
