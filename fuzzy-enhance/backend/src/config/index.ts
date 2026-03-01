export interface AppConfig {
  port: number;
  nodeEnv: string;
  corsOrigin: string;
  maxFileSize: number;
  maxImageDimension: number;
  uploadTmpDir: string;
  logLevel: string;
}

export const config: AppConfig = {
  port: Number(process.env.PORT) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  maxFileSize: 100 * 1024 * 1024,
  maxImageDimension: 2048,
  uploadTmpDir: process.env.UPLOAD_TMP_DIR || './tmp',
  logLevel: process.env.LOG_LEVEL || 'info',
};
