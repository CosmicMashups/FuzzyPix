import { Router } from 'express';
import { enhanceController } from '../controllers/enhance.controller';
import { uploadSingle } from '../middleware/upload.middleware';
import { validateEnhancementParams } from '../middleware/validation.middleware';

const router = Router();
router.post(
  '/enhance',
  (req, res, next) => {
    uploadSingle(req, res, (err) => {
      if (err) return next(err);
      next();
    });
  },
  validateEnhancementParams,
  enhanceController.enhance
);

export { router as enhanceRouter };
