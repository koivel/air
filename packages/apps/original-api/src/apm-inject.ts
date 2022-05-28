import 'reflect-metadata';

import { AirContext } from '@air/shared-utils';
import apm from 'elastic-apm-node';

import { environment } from './environments/environment';

const apmClient = apm.start({
  serviceName: '',
  secretToken: environment.apmSecret,
  serverUrl: environment.apmServerUrl,
  environment: environment.production ? 'production' : 'development',
  active: environment.production,
  captureBody: 'errors',
});

AirContext.apm = apmClient;
