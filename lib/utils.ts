import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRp(n: number): string {
  return 'Rp ' + Number(n).toLocaleString('id-ID')
}

export function statusTone(status: string): string {
  const map: Record<string, string> = {
    selesai: 'green',
    dikonfirmasi: 'blue',
    menunggu: 'amber',
    dibatalkan: 'neutral',
  }
  return map[status] ?? 'neutral'
}
