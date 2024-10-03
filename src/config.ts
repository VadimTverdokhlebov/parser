import dotenv from 'dotenv';

dotenv.config();

interface IConfig {
  port: number;
  host: string;
  appUrl?: string;
}

const config: IConfig = {
  port: parseInt(process.env.SERVER_PORT!, 10),
  host: process.env.SERVER_HOST!
};

config.appUrl = `http://${config.host}:${config.port}`;

export default config;
