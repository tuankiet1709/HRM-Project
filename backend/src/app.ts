import * as bodyParser from 'body-parser';
import express from 'express';
import fs = require('fs');
import * as swaggerUI from 'swagger-ui-express';
import morgan = require('morgan');
import morganBody from 'morgan-body';
import cors from 'cors';

class App {
  public express: express.Application;

  private swaggerFile: any = process.cwd() + '/swagger.json';
  private swaggerData: any = fs.readFileSync(this.swaggerFile, 'utf8');
  private swaggerDocument = JSON.parse(this.swaggerData);

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(cors());
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));

    this.express.use(
      morgan(':method :url :status :response-time ms - :res[content-length]'),
    );
    morganBody(this.express);
  }

  private routes(): void {
    // this.express.get('/', (req, res, next) => {
    //   res.send('Typescript App works!!');
    // });

    // swagger docs
    this.express.use(
      '/api/docs',
      swaggerUI.serve,
      swaggerUI.setup(this.swaggerDocument),
    );

    // handle undefined routes
    // this.express.use('*', (req, res, next) => {
    //   res.send('Make sure url is correct!!!');
    // });
  }
}

export default new App().express;
