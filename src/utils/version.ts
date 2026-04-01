import { coerce, compare } from 'semver';

const sanitizeVersion = (version: string | null | undefined): string | null => {
  if (!version || version.trim().toLowerCase() === 'unknown') {
    return null;
  }

  const normalized = coerce(version, { loose: true });
  return normalized?.version ?? null;
};

export const compareVersions = (v1: string, v2: string): number => {
  const cleanV1 = sanitizeVersion(v1);
  const cleanV2 = sanitizeVersion(v2);

  if (!cleanV1 && !cleanV2) {
    return 0;
  }

  if (!cleanV1) {
    return -1;
  }

  if (!cleanV2) {
    return 1;
  }

  return compare(cleanV1, cleanV2);
};

export const isVersionOutdated = (current: string, minimum: string): boolean => {
  return compareVersions(current, minimum) < 0;
};

export const isVersionBelowRecommended = (current: string, recommended: string): boolean => {
  return compareVersions(current, recommended) < 0;
};
