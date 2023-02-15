import dotenvExtended from 'dotenv-extended';
import dotenvParseVariables from 'dotenv-parse-variables';
type LogLevel =
  | 'silent'
  | 'error'
  | 'warn'
  | 'info'
  | 'http'
  | 'verbose'
  | 'debug'
  | 'silly';

const env = dotenvExtended.load({
  path: process.env.ENV_FILE,
  defaults: './env/.env.defaults',
  schema: './env/.env.schema',
  includeProcessEnv: true,
  silent: false,
  errorOnMissing: true,
  errorOnExtra: true,
});

const parsedEnv = dotenvParseVariables(env);

interface Config {
  morganLogger: boolean;
  morganBodyLogger: boolean;
  devLogger: boolean;
  loggerLevel: LogLevel;
  mongo: {
    url: string;
    useCreateIndex: boolean;
    autoIndex: boolean;
  };
  privateKeyFile: string;
  privateKeyPassphrase: string;
  publicKeyFile: string;
}

const config: Config = {
  morganLogger: parsedEnv.MORGAN_LOGGER as boolean,
  morganBodyLogger: parsedEnv.MORGAN_BODY_LOGGER as boolean,
  devLogger: parsedEnv.DEV_LOGGER as boolean,
  loggerLevel: parsedEnv.LOGGER_LEVEL as LogLevel,
  mongo: {
    url: parsedEnv.MONGO_URL as string,
    useCreateIndex: parsedEnv.MONGO_CREATE_INDEX as boolean,
    autoIndex: parsedEnv.MONGO_AUTO_INDEX as boolean,
  },
  privateKeyFile: parsedEnv.PRIVATE_KEY_FILE as string,
  privateKeyPassphrase: parsedEnv.PRIVATE_KEY_PASSPHRASE as string,
  publicKeyFile: parsedEnv.PUBLIC_KEY_FILE as string,
};

export default config;
