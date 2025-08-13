export const PHASE_CLIP_PATH =
  'polygon(0% 0%, 16px 50%, 0% 100%, calc(100% - 16px) 100%, 100% 50%, calc(100% - 16px) 0%)';

export const phaseStyles = {
  clipPath: PHASE_CLIP_PATH,
  height: 40,
  spacing: 16,
} as const;
