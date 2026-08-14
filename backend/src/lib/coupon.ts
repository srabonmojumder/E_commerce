import type { Coupon } from '@prisma/client';
import { formatMoney } from './currency.js';

export interface CouponResult {
  valid: boolean;
  discount: number;
  message: string;
}

/** Validate a coupon against an order subtotal and compute the discount. */
export function evaluateCoupon(
  coupon: Coupon | null,
  subtotal: number,
  currency: { currencySymbol: string; exchangeRate: number } = { currencySymbol: '$', exchangeRate: 1 }
): CouponResult {
  if (!coupon) return { valid: false, discount: 0, message: 'Invalid coupon code' };
  if (!coupon.active) return { valid: false, discount: 0, message: 'This coupon is no longer active' };
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, discount: 0, message: 'This coupon has expired' };
  }
  if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) {
    return { valid: false, discount: 0, message: 'This coupon has reached its usage limit' };
  }
  const min = Number(coupon.minSubtotal);
  if (subtotal < min) {
    const money = formatMoney(min, currency.currencySymbol, currency.exchangeRate);
    return { valid: false, discount: 0, message: `Minimum order of ${money} required` };
  }
  const raw = coupon.type === 'PERCENT' ? (subtotal * Number(coupon.value)) / 100 : Number(coupon.value);
  const discount = Math.min(raw, subtotal);
  return { valid: true, discount: +discount.toFixed(2), message: 'Coupon applied' };
}
