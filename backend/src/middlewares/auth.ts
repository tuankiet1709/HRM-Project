import logger from '@src/utils/logger';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { AuthResponse } from '@src/constants/response';
import { publicKey, verifyOptions } from '@src/constants/key';

export default function auth(bearerToken: string): Promise<AuthResponse> {
  return new Promise(function (resolve, reject) {
    const token = bearerToken.replace('Bearer ', '');
    jwt.verify(
      token,
      publicKey,
      verifyOptions,
      (err: VerifyErrors | null, decoded: any | undefined) => {
        if (err === null && decoded !== undefined) {
          const d = decoded as { employeeId: string; exp: number };
          if (d.employeeId) {
            resolve({ userId: d.employeeId });
            return;
          }
        }
        resolve({
          error: { type: 'unauthorized', message: 'Authentication Failed' },
        });
      },
    );
  });
}
