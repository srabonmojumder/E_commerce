import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { asyncHandler, HttpError } from '../middleware/error.js';

/** GET /api/currencies — public; the full list shoppers/admin can pick from. */
export const getCurrencies = asyncHandler(async (_req: Request, res: Response) => {
  const currencies = await prisma.currency.findMany({ orderBy: { code: 'asc' } });
  res.json({ data: currencies });
});

// ---------------- Admin CRUD ----------------

const currencySchema = z.object({
  code: z.string().min(1).max(8),
  symbol: z.string().min(1).max(8),
  label: z.string().min(1),
  rate: z.number().positive(),
});

export const adminCreateCurrency = asyncHandler(async (req: Request, res: Response) => {
  const parsed = currencySchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten().fieldErrors);
  const { code, ...rest } = parsed.data;
  const existing = await prisma.currency.findUnique({ where: { code: code.trim().toUpperCase() } });
  if (existing) throw new HttpError(409, `Currency ${code.toUpperCase()} already exists`);
  const currency = await prisma.currency.create({ data: { ...rest, code: code.trim().toUpperCase() } });
  res.status(201).json({ data: currency });
});

export const adminUpdateCurrency = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const parsed = currencySchema.partial().safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten().fieldErrors);
  const existing = await prisma.currency.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, 'Currency not found');
  const { code, ...rest } = parsed.data;
  const currency = await prisma.currency.update({
    where: { id },
    data: { ...rest, ...(code ? { code: code.trim().toUpperCase() } : {}) },
  });

  // The default currency's rate/symbol double as the store's real settlement
  // currency (Setting.currencyCode/currencySymbol/exchangeRate) — keep them in sync.
  if (existing.isDefault) {
    await prisma.setting.update({
      where: { id: 1 },
      data: {
        currencyCode: currency.code,
        currencySymbol: currency.symbol,
        exchangeRate: currency.rate,
      },
    });
  }

  res.json({ data: currency });
});

export const adminDeleteCurrency = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existing = await prisma.currency.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, 'Currency not found');
  if (existing.isDefault) throw new HttpError(400, 'Cannot delete the default currency — set another one as default first');
  await prisma.currency.delete({ where: { id } });
  res.json({ success: true });
});

/** POST /api/admin/currencies/:id/default — makes this the store's billing currency. */
export const adminSetDefaultCurrency = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const currency = await prisma.currency.findUnique({ where: { id } });
  if (!currency) throw new HttpError(404, 'Currency not found');

  await prisma.$transaction([
    prisma.currency.updateMany({ where: { isDefault: true }, data: { isDefault: false } }),
    prisma.currency.update({ where: { id }, data: { isDefault: true } }),
    prisma.setting.update({
      where: { id: 1 },
      data: { currencyCode: currency.code, currencySymbol: currency.symbol, exchangeRate: currency.rate },
    }),
  ]);

  res.json({ data: { ...currency, isDefault: true } });
});
