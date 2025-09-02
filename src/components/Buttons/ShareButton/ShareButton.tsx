import AppIconButton from '@/components/AppIconButton';
import { useAppStore } from '@/store';
import { IdeaType } from '@/types/Scopes';
import { successAlert } from '@/utils';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  idea: IdeaType;
  disabled?: boolean;
}

const ShareButton = forwardRef<HTMLButtonElement, Props>(({ idea, disabled }, ref) => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();

  const sharePath = window.location.href.includes('/idea/') ? '' : `/idea/${idea.hash_id}`;
  const absoluteUrl = `${window.location.href}${sharePath}`;

  return (
    <AppIconButton
      ref={ref}
      icon={'share'}
      title={t(`tooltips.share`)}
      data-testid="share-idea-button"
      onClick={async () => {
        if (!idea || !idea.hash_id) return; // nothing to share if idea is invalid
        try {
          if (navigator.share) {
            await navigator.share({
              title: idea.title,
              text: idea.title,
              url: absoluteUrl,
            });
          } else if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(absoluteUrl);
            successAlert(t('clipboard.linkCopied'), dispatch);
          }
        } catch (e) {
          // fallback to copying even if Web Share API fails mid-way
          try {
            await navigator.clipboard.writeText(absoluteUrl);
            successAlert(t('clipboard.linkCopied'), dispatch);
          } catch (_) {
            /* ignore */
          }
        }
      }}
      disabled={disabled}
      aria-label={t(`tooltips.share`)}
    />
  );
});

ShareButton.displayName = 'ShareButton';

export default ShareButton;
