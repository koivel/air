import 'reflect-metadata';

import { AuthApiRouter } from '@air/apis-auth-api';
import { DashboardApiRouter } from '@air/dashboard-api';
import { EventApiRouter } from '@air/event-api';
import { MongoDbService } from '@air/mongo-db';
import { AirContext, Logger } from '@air/shared-utils';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import apm from 'elastic-apm-node';
import express from 'express';
import * as OpenApiValidator from 'express-openapi-validator';
import { container } from 'tsyringe';

import { environment } from './environments/environment';

const apmClient = apm.start({
  // Override the service name from package.json
  // Allowed characters: a-z, A-Z, 0-9, -, _, and space
  serviceName: '',

  // Use if APM Server requires a secret token
  secretToken: environment.apmSecret,

  // Set the custom APM Server URL (default: http://localhost:8200)
  serverUrl: environment.apmServerUrl,

  // Set the service environment
  environment: environment.production ? 'production' : 'development',
  active: environment.production,
  captureBody: 'errors',
});

async function init() {
  AirContext.apm = apmClient;
  Logger.setupLogger();

  const mongoDbService: MongoDbService = container.resolve(MongoDbService);
  await mongoDbService.connect(__dirname + '/assets/db-mongodb-nyc3-59216.crt');

  const app = express();
  app.use(Logger.getExpressLogger());
  app.use(
    cors({
      credentials: true,
      origin: environment.production
        ? ['https://koivel.com', 'http://localhost:4200']
        : '*',
      allowedHeaders: ['Authorization', 'Content-Type'],
      maxAge: environment.production ? 86400 : null,
    })
  );

  app.use(bodyParser.json({ limit: '200mb' }));
  app.use(bodyParser.urlencoded({ limit: '200mb', extended: false }));

  app.use(
    OpenApiValidator.middleware({
      apiSpec: __dirname + '/spec/full.openapi.yml',
      validateRequests: true,
      validateResponses: false,
    })
  );

  app.use(function (req, res, next) {
    res.setHeader(
      'Apm-Trace-Id',
      AirContext.apm?.currentTransaction?.ids?.['trace.id'] || ''
    );
    next();
  });

  app.get('/api/v1/meta', (req, res) => {
    res.write('meta-1');
  });

  app.use(
    '/api/v1/event-api',
    container.resolve(EventApiRouter).attachRoutes(express.Router())
  );

  app.use(
    '/api/v1/dashboard-api',
    container.resolve(DashboardApiRouter).attachRoutes(express.Router())
  );

  app.use(
    '/api/v1/auth-api',
    container.resolve(AuthApiRouter).attachRoutes(express.Router())
  );

  app.use((err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }
    Logger.error(err.message, err);
    res.status(500);
    res.json({
      message: err.message,
      error: err,
    });
  });

  const port = process.env.port || 3333;
  const server = app.listen(port, () => {
    Logger.info(`Listening at http://localhost:${port}/api/v1/`);
  });
  server.on('error', console.error);
}

init();
