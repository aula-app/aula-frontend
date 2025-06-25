import { useTranslation } from 'react-i18next';
import { Link, styled } from '@mui/material';

/**
 * SkipNavigation component provides an accessible way for keyboard users
 * to skip repetitive navigation links and jump directly to main content.
 * It's visually hidden until focused, helping users who navigate with a keyboard.
 */

const SkipLink = styled(Link)(({ theme }) => ({
  position: 'absolute',
  top: -50,
  left: 8,
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  fontWeight: 'bold',
  zIndex: 2000,
  borderRadius: 4,
  border: `1px solid ${theme.palette.primary.main}`,
  boxShadow: theme.shadows[2],
  textDecoration: 'none',
  transition: 'top 0.2s ease',
  '&:focus': {
    top: 8,
    ...getFocusStyles(theme.palette.mode === 'dark'),
  },
}));

interface SkipNavigationProps {
  mainContentId: string;
}

const SkipNavigation: React.FC<SkipNavigationProps> = ({ mainContentId }) => {
  const { t } = useTranslation();

  return (
    <SkipLink 
      href={`#${mainContentId}`}
      aria-label={t('ui.navigation.skipToContent')}
    >
      {t('ui.navigation.skipToContent')}
    </SkipLink>
  );
};

// Helper function to get focus styles - simplified version of what we have in focusStyles.ts
const getFocusStyles = (isDarkMode: boolean) => ({
  outline: '2px solid',
  outlineColor: isDarkMode ? 'hsl(134, 20%, 40%)' : 'hsl(134, 72%, 67%)',
  outlineOffset: 2,
  boxShadow: '0 0 0 4px rgba(134, 200, 157, 0.3)',
});

export default SkipNavigation;