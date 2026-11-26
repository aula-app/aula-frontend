import { describe, expect, it } from 'vitest';
import { summarizeVersions, summarizeVersionsJson } from './versions';

const stored =
  '{"aula-backend.v1":{"aula-backend":{"running":"local","latest":"TODO"},"aula-frontend":{"minimum":"v1.4.4","recommended":"v1.6.1"}},"aula-backend.v2":{"aula-backend":{"running":"v2.3.0","latest":"TODO"},"aula-frontend":{"minimum":"v1.4.4","recommended":"v1.6.1"}},"aula-frontend":"2.0.0"}';

describe('summarizeVersions', () => {
  it('reduces the versions payload to the frontend build and each running backend', () => {
    expect(summarizeVersionsJson(stored)).toEqual([
      ['aula-frontend', '2.0.0'],
      ['aula-backend.v1', 'local'],
      ['aula-backend.v2', 'v2.3.0'],
    ]);
  });

  it('marks anything missing as unknown', () => {
    expect(summarizeVersions({ 'aula-frontend': '2.0.0' })).toEqual([
      ['aula-frontend', '2.0.0'],
      ['aula-backend.v1', 'unknown'],
      ['aula-backend.v2', 'unknown'],
    ]);
  });

  it('gives up on stored JSON it cannot read', () => {
    expect(summarizeVersionsJson('{broken')).toBeNull();
    expect(summarizeVersionsJson('"just a string"')).toBeNull();
    expect(summarizeVersionsJson(undefined)).toBeNull();
  });
});
