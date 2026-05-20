import * as fs from 'fs';
import * as path from 'path';

export const AUTH_STATES_DIR = path.join(process.cwd(), 'tests/auth-states');

export function getStorageStatePath(username: string): string {
  return path.join(AUTH_STATES_DIR, `${username}-context.json`);
}

export function hasStorageState(username: string): boolean {
  return fs.existsSync(getStorageStatePath(username));
}
