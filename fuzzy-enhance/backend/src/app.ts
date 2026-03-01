import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config';
import { apiRouter } from './routes';
import { errorMiddleware } from './middleware/error.middleware';

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: config.corsOrigin }));
  app.use(morgan('combined'));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  app.get('/', (_req, res) => {
    res.redirect(302, '/api');
  });

  app.use('/api', apiRouter);

  app.use((_req, res) => {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Not found' } });
  });

  app.use(errorMiddleware);

  return app;
}
