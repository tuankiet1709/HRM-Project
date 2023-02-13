import * as express from 'express';
import logger from './logger';

export const expressDevLogger = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void => {
  const startHrTime = process.hrtime();

  logger.http(
    `Request: ${req.method} ${
      req.url
    } at ${new Date().toUTCString()}, User-Agent: ${req.get('User-Agent')}`,
  );
  logger.http(`Request Body: ${JSON.stringify(req.body)}`);

  const [oldWrite, oldEnd] = [res.write, res.end];
  const chunks: Buffer[] = [];
  (res.write as unknown) = function (chunk: any, ...args: any): void {
    chunks.push(Buffer.from(chunk));
    (oldWrite as () => any).apply(res, args);
  };

  res.end = function (chunk: any, ...args: any): any {
    if (chunk) {
      chunk.push(Buffer.from(chunk));
    }

    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;

    logger.http(`Response ${res.statusCode} ${elapsedTimeInMs.toFixed(3)} ms`);

    const body = Buffer.concat(chunks).toString('utf8');
    logger.http(`Response Body: ${body}`);
    (oldEnd as () => any).apply(res, args);
  };

  next();
};
