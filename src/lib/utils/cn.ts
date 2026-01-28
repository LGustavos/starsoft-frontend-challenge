import { clsx, type ClassValue } from 'clsx';

/**
 * Utility function to merge class names
 * Similar to tailwind-merge but simpler for SCSS modules
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
