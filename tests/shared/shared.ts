import fs from 'fs';
import dotenv from 'dotenv';

// configure the environment to get the running dev server
dotenv.config({ path: '.env.playwright' });

// we want to make sure we are only running tests on non-prod frontends
if (!process.env.APP_FRONTEND_HOST || process.env.APP_FRONTEND_HOST.toString().match(/(?:prod|neu)\.aula\.de/)) {
  throw new Error('APP_FRONTEND_HOST must be configured, and non-production');
}

// success - log
console.info('[info] using frontend:', process.env.APP_FRONTEND_HOST);

// note, playwright runs each test in different threads, therefore
// these values can't be relied upon being the same.
// rely on setRunId during setup, then getRunId during tests.
export const now = new Date();
export const timestring = now.toISOString();
export const timestamp = now.getTime().toString();

export const getHost = () => process.env.APP_FRONTEND_HOST!!;

export const getRunId = () => fs.readFileSync('run-id.txt', 'utf-8');

export const setRunId = () => fs.writeFileSync('run-id.txt', 'run-id-' + timestamp);

export function gensym(prefix = 'GG') {
  // tests will fail on collision.. very rare
  const rand = Math.random().toString(36).slice(2, 10); // letters + digits
  return `${prefix}${rand}`;
}

export function cssEscape(str: string) {
  return str.replace(/[^a-zA-Z0-9_\u00A0-\u10FFFF-]/g, (c) => {
    return '\\' + c.charCodeAt(0).toString(16) + ' ';
  });
}
