import { createApp } from './app';
import { config } from './config';
import { logger } from './config/logger';
import fs from 'fs';

const app = createApp();
const PORT = config.port;

if (!fs.existsSync(config.uploadTmpDir)) {
  fs.mkdirSync(config.uploadTmpDir, { recursive: true });
}

app.listen(PORT, () => {
  logger.info(`FuzzyEnhance API running on port ${PORT}`);
  logger.info(`Environment: ${config.nodeEnv}`);
});
