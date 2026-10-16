/** Sets voting options and values:
 * -1 - Against
 * 0 - Neutral
 * 1 - For
 */

export type Vote = -1 | 0 | 1;
export const votingOptions = ['against', 'neutral', 'for'] as ['against', 'neutral', 'for'];

/** An idea's results-phase verdict, once someone has passed one. */
export type Verdict = 1 | -1;

/**
 * The verdict an idea carries, or null where nobody has ruled on it. A new idea starts at
 * 0 and the column is nullable, so only the two decided values count — and the API sends
 * the field as a number or a string depending on the endpoint.
 */
export const toVerdict = (stored: unknown): Verdict | null => {
  const value = Number(stored);
  return value === 1 ? 1 : value === -1 ? -1 : null;
};

/** Whether an idea won. Never test `is_winner` for truthiness: a rejected -1 passes that. */
export const isWinner = (stored: unknown): boolean => toVerdict(stored) === 1;
