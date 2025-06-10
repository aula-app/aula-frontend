import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface EmptyStateProps {
  image?: string;
  title?: string;
  description?: string;
  imageWidth?: number;
  imageAlt?: string;
}

/**
 * EmptyState component for displaying when pages have no content
 * @param image - Path to the image to display (defaults to Paula sleeping)
 * @param title - Title text to display
 * @param description - Optional description text
 * @param imageWidth - Width of the image (defaults to 150)
 * @param imageAlt - Alt text for the image
 * @returns React component displaying empty state
 */
const EmptyState = ({
  image = '/img/Paula_schlafend.svg',
  title,
  description,
  imageWidth = 150,
  imageAlt = 'Empty state',
}: EmptyStateProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Stack flex={1} alignItems="center" justifyContent="center" spacing={2}>
      <img src={image} alt={imageAlt} loading="lazy" width={imageWidth} />
      <Typography variant="h3" textAlign="center">
        {title || t('common.noContent')}
      </Typography>
      {description && (
        <Typography variant="body1" textAlign="center" color="text.secondary">
          {description}
        </Typography>
      )}
    </Stack>
  );
};

export default EmptyState;
