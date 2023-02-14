import 'reflect-metadata';
import App from '@src/app';
import logger from '@src/utils/logger';
import db from '@src/utils/db';
import { InversifyExpressServer, getRouteInfo } from 'inversify-express-utils';
import container from '@src/config/inversify.config';
import * as prettyjson from 'prettyjson';

const port = process.env.PORT || 3000;
App.set('port', port);

const server = new InversifyExpressServer(
  container,
  null,
  { rootPath: '/api' },
  App,
);
const appConfigured = server.build();

const routeInfo = getRouteInfo(container);
logger.info(prettyjson.render({ routes: routeInfo }));

db.open();

appConfigured.listen(port, () => {
  logger.info('Server is listening on port', port);
});
