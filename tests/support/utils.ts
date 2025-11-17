import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// configure the environment to get the running dev server
dotenv.config({ path: '.env.playwright' });

// we want to make sure we are only running tests on non-prod frontends
if (!process.env.APP_FRONTEND_HOST || process.env.APP_FRONTEND_HOST.toString().match(/(?:prod|neu)\.aula\.de/)) {
  throw new Error('APP_FRONTEND_HOST must be configured, and non-production');
}

console.info('[info] using frontend:', process.env.APP_FRONTEND_HOST);

const now = new Date();
const timestamp = now.getTime().toString();

const runIdFilePath = 'tests/auth-states/run-id.txt';

export const getHost = () => process.env.APP_FRONTEND_HOST!!;

export const getRunId = () => {
  const runIdDir = path.dirname(runIdFilePath);

  try {
    // Check if directory exists, create if it doesn't
    if (!fs.existsSync(runIdDir)) {
      fs.mkdirSync(runIdDir, { recursive: true });
    }

    // Check if file exists, create if it doesn't
    if (!fs.existsSync(runIdFilePath)) {
      const newRunId = 'run-id-' + timestamp;
      fs.writeFileSync(runIdFilePath, newRunId, 'utf-8');
      return newRunId;
    } else {
      return fs.readFileSync(runIdFilePath, 'utf-8').trim();
    }
  } catch (error) {
    console.error('Error handling run-id file:', error);
    return 'run-id-' + timestamp;
  }
};

export function gensym(prefix = 'GG') {
  // tests will fail on collision.. very rare
  const rand = Math.random().toString(36).slice(2, 18); // letters + digits
  return `${prefix}${rand}`;
}

export function cssEscape(str: string) {
  return str.replace(/[^a-zA-Z0-9_\u00A0-\u10FFFF-]/g, (c) => {
    return '\\' + c.charCodeAt(0).toString(16) + ' ';
  });
}
