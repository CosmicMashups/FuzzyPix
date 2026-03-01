import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import { processImage } from '../services/enhancement.service';
import { AppError } from '../middleware/error.middleware';
import type { ValidatedEnhancementParams } from '../middleware/validation.middleware';

interface EnhanceRequest extends Request {
  file?: Express.Multer.File;
  validatedParams?: ValidatedEnhancementParams;
}

export const enhanceController = {
  enhance: async (req: EnhanceRequest, res: Response, next: NextFunction): Promise<void> => {
    const file = req.file;
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log('[enhance] file:', file ? `${file.fieldname} ${file.originalname} ${file.size}b` : 'none', 'body keys:', Object.keys(req.body || {}));
    }
    if (!file || !file.path) {
      next(new AppError(400, 'MISSING_IMAGE', 'No image file provided'));
      return;
    }
    const params = req.validatedParams;
    if (!params) {
      next(new AppError(400, 'VALIDATION_ERROR', 'Invalid or missing parameters'));
      return;
    }
    try {
      const result = await processImage(file.path, params);
      res.json({
        success: true,
        data: {
          enhancedImageBase64: result.enhancedImageBase64,
          originalHistogram: result.originalHistogram,
          enhancedHistogram: result.enhancedHistogram,
          metrics: result.metrics,
          processingTimeMs: result.processingTimeMs,
          metadata: result.metadata,
        },
      });
    } catch (e) {
      next(e);
    } finally {
      try {
        if (file.path && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (_) {
        // ignore cleanup errors
      }
    }
  },
};
