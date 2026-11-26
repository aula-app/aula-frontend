/** Sets voting options and values:
 * -1 - Against
 * 0 - Neutral
 * 1 - For
 */

export type Vote = -1 | 0 | 1;
export const votingOptions = ['against', 'neutral', 'for'] as ['against', 'neutral', 'for'];

export type Verdict = 1 | -1;

/** The API sends a number or a string. */
export const toVerdict = (stored: unknown): Verdict | null => {
  const value = Number(stored);
  return value === 1 ? 1 : value === -1 ? -1 : null;
};

/** Don't test `is_winner` for truthiness: -1 is truthy. */
export const isWinner = (stored: unknown): boolean => toVerdict(stored) === 1;
