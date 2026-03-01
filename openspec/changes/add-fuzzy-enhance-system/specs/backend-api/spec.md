# Spec Delta: backend-api

## ADDED Requirements

### Requirement: Express application factory

The backend SHALL provide createApp() returning an Express Application with Helmet security headers, CORS (configurable origin from env), Morgan HTTP logging (combined format), JSON body parser (limit 50MB), URL-encoded parser, routes mounted at /api, global error middleware last, and 404 handler for unmatched routes.

#### Scenario: App starts and responds to health

- **WHEN** createApp() is used to listen on a port and GET /api/health is requested
- **THEN** response status is 200 and body includes status and timestamp

### Requirement: Configuration and logger

The backend SHALL load config from environment (port, nodeEnv, corsOrigin, maxFileSize, maxImageDimension, uploadTmpDir, logLevel) and expose a Winston logger singleton with console transport, level from config, and timestamp format.

#### Scenario: Config defaults when env missing

- **WHEN** PORT and NODE_ENV are not set
- **THEN** config.port and config.nodeEnv have defined defaults (e.g. 3001, 'development')

### Requirement: Upload middleware

The backend SHALL use Multer with diskStorage writing to config.uploadTmpDir with UUID filenames, file filter accepting only image/jpeg and image/png, and file size limit config.maxFileSize. Export uploadSingle for single file under field name 'image'.

#### Scenario: Reject non-image upload

- **WHEN** a request includes a file with non-image MIME type
- **THEN** Multer or downstream validation rejects with appropriate error

### Requirement: Validation middleware

The backend SHALL validate enhancement request body with Zod: windowRadius (int 1-10, default 2), nDelta (int 51-1001, default 255), defuzzMethod (enum centroid|bisector|mom), applyPostFilter (boolean), tnorm (min|product), implicationMethod (min|product). Validated params SHALL be attached to the request for the controller.

#### Scenario: Default params when body partial

- **WHEN** POST /api/enhance has image but missing optional fields
- **THEN** validated params contain defaults for omitted fields

### Requirement: Error middleware

The backend SHALL use a global error handler that catches Multer errors (file size, type), Zod validation errors, and custom AppError; respond with JSON { success: false, error: { code, message, details? } }; use HTTP 400 for validation, 413 for file size, 422 for processing, 500 for internal errors.

#### Scenario: Validation error returns 400

- **WHEN** request body fails Zod schema
- **THEN** response status is 400 and body contains error code and message

### Requirement: Enhance controller

The enhance controller SHALL: ensure req.file exists; read validated params from body; call enhancementService.processImage(filePath, params); delete temp file in finally; return JSON matching EnhancementResponse (success, data with enhancedImageBase64, histograms, metrics, processingTimeMs, metadata); call next(error) on failure.

#### Scenario: Successful enhance returns 200 and data

- **WHEN** valid image and params are provided
- **THEN** response is 200 and data includes enhancedImageBase64, originalHistogram, enhancedHistogram, metrics, processingTimeMs, metadata

### Requirement: Health controllers

The backend SHALL provide GET /api/health returning { status: 'ok', timestamp: ISO string, uptime } and GET /api/health/detailed returning status, version, nodeVersion, platform, memoryUsage, uptime.

#### Scenario: Health check responds

- **WHEN** GET /api/health is requested
- **THEN** status is 200 and body.status is 'ok'

### Requirement: Route aggregation

The backend SHALL mount enhance routes at /api (e.g. /api/enhance) and health routes at /api (e.g. /api/health, /api/health/detailed) via a single route aggregator.

#### Scenario: Enhance and health both under /api

- **WHEN** server is running
- **THEN** /api/enhance and /api/health are reachable

### Requirement: Server entry point

The backend SHALL have an entry point (e.g. src/index.ts) that creates the app from createApp(), reads port from config, and calls listen with logger output for port and environment.

#### Scenario: Dev server starts

- **WHEN** npm run dev (or equivalent) is executed
- **THEN** server listens on configured port and logs startup message
