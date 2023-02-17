import { injectable } from 'inversify';
import express from 'express';
import { BaseMiddleware } from 'inversify-express-utils';
import auth from './auth';
import { writeJsonResponse } from '@src/utils/express';
import logger from '@src/utils/logger';

@injectable()
export default class AuthMiddleware extends BaseMiddleware {
  async handler(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const token = req.headers.authorization;
    try {
      if (token) {
        const authResponse = await auth(token);

        if (!(authResponse as any).error) {
          res.locals.auth = {
            userId: (authResponse as { userId: string }).userId,
          };
          next();
        } else {
          writeJsonResponse(res, 401, authResponse);
        }
      } else {
        writeJsonResponse(res, 500, {
          error: { type: 'unauthorized', message: 'Authentication Failed' },
        });
      }
    } catch (err) {
      writeJsonResponse(res, 500, {
        error: {
          type: 'internal_server_error',
          message: 'Internal Server Error',
        },
      });
    }
  }
}
