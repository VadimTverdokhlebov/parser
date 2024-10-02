import dotenv from 'dotenv';

dotenv.config();

interface IConfig {
  serverPort: number;
  serverHost: string;
}

const config: IConfig = {
  serverPort: parseInt(process.env.SERVER_PORT!, 10),
  serverHost: process.env.SERVER_HOST!
};

export default config;
