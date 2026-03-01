import { Router } from 'express';
import { enhanceRouter } from './enhance.routes';
import { healthRouter } from './health.routes';

const router = Router();
router.get('/', (_req, res) => {
  res.json({
    name: 'FuzzyEnhance API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      healthDetailed: '/api/health/detailed',
      enhance: 'POST /api/enhance',
    },
  });
});
router.use(enhanceRouter);
router.use(healthRouter);

export { router as apiRouter };
