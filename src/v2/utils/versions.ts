import { VersionsResponse } from '@/services/requests-v2';

type PartialVersions = {
  [K in keyof VersionsResponse]?: VersionsResponse[K] extends string ? string : Partial<VersionsResponse[K]>;
};

export const summarizeVersions = (versions?: PartialVersions): [string, string][] => [
  ['aula-frontend', versions?.['aula-frontend'] ?? 'unknown'],
  ['aula-backend.v1', versions?.['aula-backend.v1']?.['aula-backend']?.running ?? 'unknown'],
  ['aula-backend.v2', versions?.['aula-backend.v2']?.['aula-backend']?.running ?? 'unknown'],
];

export const summarizeVersionsJson = (json?: string): [string, string][] | null => {
  if (!json) return null;
  try {
    const parsed = JSON.parse(json);
    return parsed && typeof parsed === 'object' ? summarizeVersions(parsed) : null;
  } catch {
    return null;
  }
};
