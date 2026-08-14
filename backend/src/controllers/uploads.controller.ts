import path from 'node:path';
import crypto from 'node:crypto';
import type { Request, Response } from 'express';
import multer from 'multer';
import { put } from '@vercel/blob';
import { HttpError, asyncHandler } from '../middleware/error.js';

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);

/** multer middleware: a single image field named "file", max 5 MB, images only. */
export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED.has(file.mimetype)) cb(null, true);
    else cb(new HttpError(400, 'Only image files are allowed (jpg, png, webp, gif, avif)'));
  },
}).single('file');

/** POST /api/admin/uploads — stores the image in Vercel Blob, returns its public URL. */
export const handleUpload = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw new HttpError(400, 'No file uploaded');
  const ext = path.extname(req.file.originalname).toLowerCase() || '.jpg';
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
  const blob = await put(filename, req.file.buffer, {
    access: 'public',
    contentType: req.file.mimetype,
  });
  res.status(201).json({ url: blob.url });
});
