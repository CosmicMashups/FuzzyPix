import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const EnhancementParamsSchema = z.object({
  windowRadius: z.coerce.number().int().min(1).max(10).default(2),
  nDelta: z.coerce.number().int().min(51).max(1001).default(255),
  defuzzMethod: z.enum(['centroid', 'bisector', 'mom']).default('centroid'),
  applyPostFilter: z.coerce.boolean().default(false),
  tnorm: z.enum(['min', 'product']).default('min'),
  implicationMethod: z.enum(['min', 'product']).default('min'),
});

export type ValidatedEnhancementParams = z.infer<typeof EnhancementParamsSchema>;

export function validateEnhancementParams(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const parsed = EnhancementParamsSchema.safeParse(req.body);
  if (parsed.success) {
    (req as Request & { validatedParams: ValidatedEnhancementParams }).validatedParams = parsed.data;
    next();
  } else {
    next(parsed.error);
  }
}
