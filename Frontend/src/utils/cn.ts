import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCLP = (value: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(value);
};

export const formatKG = (value: number) => {
  if (value < 1) {
    return Math.round(value * 1000) + ' g';
  }
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(value) + ' kg';
};
