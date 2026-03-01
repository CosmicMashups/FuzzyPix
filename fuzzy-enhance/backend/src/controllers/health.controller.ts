import { Request, Response } from 'express';

export const healthController = {
  check(_req: Request, res: Response): void {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  },
  detailed(_req: Request, res: Response): void {
    const mem = process.memoryUsage();
    res.json({
      status: 'ok',
      version: '1.0.0',
      nodeVersion: process.version,
      platform: process.platform,
      memoryUsage: {
        rss: mem.rss,
        heapTotal: mem.heapTotal,
        heapUsed: mem.heapUsed,
      },
      uptime: process.uptime(),
    });
  },
};
