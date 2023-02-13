import * as http from 'http';
import App from '@src/app';
import logger from '@src/utils/logger';
import db from '@src/utils/db';

const port = process.env.PORT || 3000;

App.set('port', port);
const server = http.createServer(App);

db.open().then(() => {
  server.listen(port, () => {
    const addr = server.address();
    const bind =
      typeof addr === 'string' ? `pipe ${addr}` : `port ${addr!.port}`;
    logger.info('Server run with port: ' + bind);
  });
});
