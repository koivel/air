import { StrictMode } from 'react';
import { CookiesProvider } from 'react-cookie';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/app';
import { KoivelAuthProvider } from './app/contexts/koivel-auth';
import 'react-toastify/dist/ReactToastify.css';
import { init as initApm } from '@elastic/apm-rum';
import { environment } from './environments/environment';
import { ToastContainer } from 'react-toastify';
const apm = initApm({
  // Set required service name (allowed characters: a-z, A-Z, 0-9, -, _, and space)
  serviceName: 'original-app',

  // Set custom APM Server URL (default: http://localhost:8200)
  serverUrl:
    'https://eebac73e154942a7b1e204d85e56c547.apm.us-central1.gcp.cloud.es.io:443',

  // Set the service version (required for source map feature)
  serviceVersion: '',

  // Set the service environment
  environment: environment.production ? 'production' : 'dev',
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <CookiesProvider>
      <BrowserRouter>
        <KoivelAuthProvider>
          <App />
        </KoivelAuthProvider>
      </BrowserRouter>
    </CookiesProvider>
  </StrictMode>
);
