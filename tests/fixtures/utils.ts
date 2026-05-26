import * as path from 'path';
import { Route } from "@playwright/test";

export const AUTH_STATES_DIR = path.join(process.cwd(), 'tests/auth-states');

export function getStorageStatePath(username: string): string {
  return path.join(AUTH_STATES_DIR, `${username}-context.json`);
}

const RESOURCE_EXCLUSIONS = ['image', 'stylesheet', 'media', 'font', 'other'];
export const FILTER_EXCLUDED_RESOURCES = (route: Route) =>
  RESOURCE_EXCLUSIONS.includes(route.request().resourceType()) ? route.abort() : route.continue();
