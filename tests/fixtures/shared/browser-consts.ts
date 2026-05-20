import { Route } from "@playwright/test";

const RESOURCE_EXCLUSIONS = ['image', 'stylesheet', 'media', 'font', 'other'];
export const FILTER_EXCLUDED_RESOURCES = (route: Route) =>
  RESOURCE_EXCLUSIONS.includes(route.request().resourceType()) ? route.abort() : route.continue();
