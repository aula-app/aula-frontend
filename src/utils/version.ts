const sanitizeVersion = (version: string | null | undefined): string => {
  if (!version) return '';
  return version.replace(/[^0-9.]/g, '');
};

const parseVersion = (version: string | null | undefined): [number, number, number] => {
  const cleanVersion = sanitizeVersion(version);

  if (!cleanVersion || cleanVersion === 'unknown') {
    return [0, 0, 0];
  }

  const parts = cleanVersion.split('.').map((part) => {
    const num = parseInt(part, 10);
    return isNaN(num) ? 0 : num;
  });

  return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
};

export const compareVersions = (v1: string, v2: string): number => {
  const [major1, minor1, patch1] = parseVersion(v1);
  const [major2, minor2, patch2] = parseVersion(v2);

  // Compare major version
  if (major1 !== major2) {
    return major1 < major2 ? -1 : 1;
  }

  // Compare minor version
  if (minor1 !== minor2) {
    return minor1 < minor2 ? -1 : 1;
  }

  // Compare patch version
  if (patch1 !== patch2) {
    return patch1 < patch2 ? -1 : 1;
  }

  // Versions are equal
  return 0;
};

export const isVersionOutdated = (current: string, minimum: string): boolean => {
  return compareVersions(current, minimum) < 0;
};

export const isVersionBelowRecommended = (current: string, recommended: string): boolean => {
  return compareVersions(current, recommended) < 0;
};
