import { Router } from 'express';
import { healthController } from '../controllers/health.controller';

const router = Router();
router.get('/health', healthController.check);
router.get('/health/detailed', healthController.detailed);

export { router as healthRouter };
