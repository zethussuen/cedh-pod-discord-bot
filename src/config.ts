import dotenv from 'dotenv';
dotenv.config();

export interface Config {
  token: string;
  clientId: string;
}

function validateEnv(): Config {
  const token = process.env.DISCORD_BOT_TOKEN;
  const clientId = process.env.DISCORD_CLIENT_ID;

  if (!token) {
    throw new Error('DISCORD_BOT_TOKEN is required in .env file');
  }

  if (!clientId) {
    throw new Error('DISCORD_CLIENT_ID is required in .env file');
  }

  return {
    token,
    clientId,
  };
}

export const config = validateEnv();
