import { ScopeType } from '@/types/Scopes';
import { SettingNamesType } from '@/types/SettingsTypes';
import DataConfig from '@/utils/Data';
import { Drawer, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import IdeaForms from '../DataForms/IdeaForms';

interface Props {
  item?: Partial<ScopeType>;
  scope: SettingNamesType;
  parentId: string;
  isOpen: boolean;
  onClose: () => void;
}

const AddData = ({ isOpen, scope, parentId, onClose }: Props) => {
  const { t } = useTranslation();

  return (
    <Drawer anchor="bottom" open={isOpen} onClose={onClose} sx={{ overflowY: 'auto' }} key={scope}>
      <Stack p={2} overflow="auto" gap={2}>
        <Typography variant="h4">
          {t(`actions.add`, { var: t(`scopes.${DataConfig[scope].requests.name}.name`) })}
        </Typography>
        <IdeaForms parentId={parentId} />
      </Stack>
    </Drawer>
  );
};

export default AddData;
