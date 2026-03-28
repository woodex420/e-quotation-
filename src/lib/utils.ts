import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'PKR') {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount).replace('PKR', 'PKR ');
}

export function generateQuoteId(lastId: string | null): string {
  if (!lastId) return 'WF-10050';
  // Extract number even if there is a suffix like -DUP
  const match = lastId.match(/WF-(\d+)/);
  if (!match) return 'WF-10050';
  const num = parseInt(match[1]);
  return `WF-${num + 1}`;
}
