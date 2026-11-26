import { addIdeaBox, removeIdeaBox } from '@/services/ideas';
import { UpdateType } from '@/types/SettingsTypes';

/** Resolves with the first error, if any. */
export const syncBoxIdeas = async (boxId: string, updates?: UpdateType): Promise<string | undefined> => {
  if (!updates || (!updates.add.length && !updates.remove.length)) return;

  const responses = await Promise.all([
    ...updates.add.map((ideaId) => addIdeaBox(ideaId, boxId)),
    ...updates.remove.map((ideaId) => removeIdeaBox(ideaId, boxId)),
  ]);

  return responses.find((response) => response.error)?.error ?? undefined;
};
