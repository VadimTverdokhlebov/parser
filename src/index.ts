import express from 'express';
import path from 'path';
import config from './config';
import Router from './routes/index';

(function () {
  try {
    const app = express();
    const PORT = config.serverPort;
    const HOST = config.serverHost;
    const publicPath = path.join(__dirname, 'public');

    app.use(express.json());
    app.use(express.static(publicPath));
    app.use('/', Router);
    app.listen(PORT, () => console.log(`Express HTTP server listening on http://${HOST}:${PORT}`));
  } catch (err) {
    console.error('Start server error:', err);
  }
})();
