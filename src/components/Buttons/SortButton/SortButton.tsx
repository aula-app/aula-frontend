import AppIcon from '@/components/AppIcon';
import AppIconButton from '@/components/AppIconButton';
import { IconButtonProps, Menu, MenuItem } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props extends Omit<IconButtonProps, 'onSelect'> {
  options: Array<{ label: string; value: string }>;
  onSelect: (orderby: string) => void;
  onReorder: (asc: boolean) => void;
}

const SortButton: React.FC<Props> = ({ options, onSelect, onReorder, disabled = false, ...restOfProps }) => {
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [asc, setAsc] = useState<boolean>(false);
  const [openOptions, setOpenOptions] = useState(false);
  const [orderby, setOrderby] = useState<string>(options[0].value);

  const handleSortToggle = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpenOptions(!openOptions);
  };

  const handleSortClose = () => {
    setAnchorEl(null);
    setOpenOptions(false);
  };

  const handleSortSelect = (value: string) => {
    if (orderby === value) {
      // If selecting the same option, toggle asc/desc
      const newAsc = !asc;
      setAsc(newAsc);
      onReorder(newAsc);
    } else {
      // If selecting a different option, set new orderby and reset to ascending
      setOrderby(value);
      setAsc(false);
      onSelect(value);
      onReorder(false);
    }
    setAnchorEl(null);
    setOpenOptions(false);
  };

  return (
    <Stack>
      <AppIconButton
        id="sort-button"
        icon={asc ? 'sortUp' : 'sort'}
        title={t('actions.sort')}
        onClick={handleSortToggle}
        aria-label={`${t('actions.sort')} ${asc ? t('ui.sort.ascending') : t('ui.sort.descending')}`}
        aria-haspopup="true"
        aria-expanded={Boolean(openOptions)}
        {...restOfProps}
      />
      <Menu
        anchorEl={anchorEl}
        open={openOptions}
        onClose={handleSortClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => handleSortSelect(option.value)}
            selected={orderby === option.value}
          >
            <Stack direction="row" justifyContent="space-between" width="100%">
              {option.label}
              {orderby === option.value ? (
                <AppIcon ml={2} size="small" icon={asc ? 'sortUp' : 'sort'} />
              ) : (
                <Box ml={2} width="18px" />
              )}
            </Stack>
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  );
};

export default SortButton;
