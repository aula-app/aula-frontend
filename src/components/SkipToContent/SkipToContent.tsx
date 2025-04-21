import React from 'react';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';

const SkipLink = styled('a')(({ theme }) => ({
  position: 'absolute',
  top: -40,
  left: 0,
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(1, 2),
  zIndex: theme.zIndex.tooltip + 1,
  transition: theme.transitions.create('top'),
  textDecoration: 'none',
  borderRadius: '0 0 4px 0',
  fontWeight: 500,
  '&:focus': {
    top: 0,
    outline: `2px solid ${theme.palette.primary.dark}`,
  },
}));

/**
 * SkipToContent component - provides a skip link for keyboard users
 * to bypass navigation and go directly to main content
 */
const SkipToContent: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <SkipLink href="#main-content">
      {t('accessibility.skipToContent')}
    </SkipLink>
  );
};

export default SkipToContent;