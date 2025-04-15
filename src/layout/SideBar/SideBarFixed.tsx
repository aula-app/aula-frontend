import { Button, Chip, Divider, Stack } from '@mui/material';
import { memo } from 'react';
import { fixedSideBarStyles } from './styles';
import SideBarContent from './SideBarContent';
import { localStorageGet } from '@/utils';
import { useTranslation } from 'react-i18next';
import UserInfo from '@/components/UserInfo';

/**
 * Renders fixed SideBar with Menu and User details for desktop view
 * @component SideBarFixed
 * @returns {JSX.Element} Rendered SideBarFixed component
 */
const SideBarFixed = ({ ...restOfProps }): JSX.Element => {
  const { t } = useTranslation();
  const code = localStorageGet('code');

  return (
    <Stack className="noPrint" pt={1} sx={fixedSideBarStyles} {...restOfProps}>
      {import.meta.env.VITE_APP_MULTI !== 'false' && (
        <>
          <Button onClick={() => navigator.clipboard.writeText(code)} color="secondary">
            {`${t('instance.chip')}: ${code}`}
          </Button>
          <Divider />
        </>
      )}
      <UserInfo />
      <Divider />
      <SideBarContent isFixed />
    </Stack>
  );
};

export default memo(SideBarFixed);
