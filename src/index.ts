import express from 'express';
import config from './config';
import Router from './routes/index';
import { tmpPath } from './shared/utils';

(function () {
  try {
    const app = express();
    app.use(express.json());
    app.use(express.static(tmpPath));
    app.use('/', Router);
    app.listen(config.port, () => console.log(`Express HTTP server listening on ${config.appUrl}`));
  } catch (err) {
    console.error('Start server error:', err);
  }
})();
