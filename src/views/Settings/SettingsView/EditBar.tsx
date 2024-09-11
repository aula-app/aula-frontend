import AppIcon from '@/components/AppIcon';
import { AllIconsType } from '@/components/AppIcon/AppIcon';
import { SettingNamesType } from '@/types/SettingsTypes';
import DataConfig from '@/utils/Data';
import { SubdirectoryArrowRight } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import { grey } from '@mui/material/colors';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

type Params = {
  onAlter: Dispatch<
    SetStateAction<{
      open: boolean;
      id?: number;
    }>
  >;
  onDelete: Dispatch<SetStateAction<boolean>>;
  onMove: Dispatch<SetStateAction<boolean>>;
  scope: SettingNamesType;
  selected: number[];
};

const EditBar = ({ scope, selected, onAlter, onMove, onDelete }: Params) => {
  const { t } = useTranslation();
  const currentIcon =
    DataConfig[scope].requests.isChild && DataConfig[DataConfig[scope].requests.isChild].requests.item !== 'Topic'
      ? (DataConfig[DataConfig[scope].requests.isChild].requests.item.toLowerCase() as AllIconsType)
      : 'box';
  return (
    <Stack direction="row" bottom={0} height={37} bgcolor={grey[200]} px={1} alignItems="center">
      <SubdirectoryArrowRight sx={{ ml: 3, fontSize: '1rem' }} color="secondary" />
      {selected.length === 0 ? (
        <Button onClick={() => onAlter({ open: true })}>
          <AppIcon sx={{ mr: 1 }} icon="add" /> {t('generics.add', { var: t(`views.${scope}`) })}
        </Button>
      ) : (
        <>
          <Button color="error" onClick={() => onDelete(true)}>
            <AppIcon sx={{ mr: 1 }} icon="delete" /> {t('generics.delete')}
          </Button>
          {DataConfig[scope].requests.isChild && (
            <Button disabled={selected.length === 0} color="secondary" onClick={() => onMove(true)}>
              <AppIcon sx={{ mr: 1 }} icon={currentIcon} />{' '}
              {t('texts.addToParent', {
                var:
                  DataConfig[scope].requests.isChild === 'boxes'
                    ? 'box'
                    : DataConfig[DataConfig[scope].requests.isChild].request.model.toLowerCase(),
              })}
            </Button>
          )}
        </>
      )}
    </Stack>
  );
};

export default EditBar;
