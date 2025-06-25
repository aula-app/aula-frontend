import fs from 'fs';

const dotenv = require('dotenv');

// configure the environment to get the running dev server
dotenv.config({ path: '.env.local' });
dotenv.config();

// we want to make sure we are only running tests on local frontends and
// backends, as to not pollute any remote databases
if (
  !process.env.APP_FRONTEND_HOST ||
  !process.env.VITE_APP_API_URL ||
  !process.env.APP_FRONTEND_HOST.toString().includes('local') ||
  !process.env.VITE_APP_API_URL.toString().includes('local')
) {
  throw new Error('APP_FRONTEND_HOST and VITE_APP_API_URL must be configured, and local');
}

// success - log
console.info('[info] using frontend:', process.env.APP_FRONTEND_HOST);
console.info('[info] connected to backend:', process.env.VITE_APP_API_URL);

// note, playwright runs each test in different threads, therefore
// these values can't be relied upon being the same.
// rely on setRunId during setup, then getRunId during tests.
const now = new Date();
const timestring = now.toISOString();
const timestamp = now.getTime().toString();

// TODO get from env
export const getHost = () => process.env.APP_FRONTEND_HOST;

export const getRunId = () => fs.readFileSync('run-id.txt', 'utf-8');

const setRunId = () => fs.writeFileSync('run-id.txt', 'run-id-' + timestamp);

export function gensym(prefix = 'GG') {
  // tests will fail on collision.. very rare
  const rand = Math.random().toString(36).slice(2, 10); // letters + digits
  return `${prefix}${rand}`;
}

export function cssEscape(str) {
  return str.replace(/[^a-zA-Z0-9_\u00A0-\u10FFFF-]/g, (c) => {
    return '\\' + c.charCodeAt(0).toString(16) + ' ';
  });
}
