import config from '@src/config';
import { SignOptions, VerifyOptions } from 'jsonwebtoken';
import fs from 'fs';

const privateKey = fs.readFileSync(config.privateKeyFile);
export const privateSecret = {
  key: privateKey,
  passphrase: config.privateKeyPassphrase,
};
export const signOptions: SignOptions = {
  algorithm: 'RS256',
  expiresIn: '14d',
};

export const publicKey = fs.readFileSync(config.publicKeyFile);
export const verifyOptions: VerifyOptions = {
  algorithms: ['RS256'],
};
