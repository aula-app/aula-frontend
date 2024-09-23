import { ObjectPropByName } from '@/types/Generics';
import { FormControlLabel, Switch } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { updateType } from '../../EditData/EditData';

type Props = {
  id: number;
  defaultValue: boolean;
  addUpdate: (newUpdate: updateType | updateType[]) => void;
};

/**
 * Renders "SetWinnerField" component
 */

const SetWinnerField = ({ id, defaultValue, addUpdate }: Props) => {
  const { t } = useTranslation();

  const toggleWinner = (event: React.ChangeEvent<HTMLInputElement>) => {
    addUpdate({ model: 'Idea', method: event.target.checked ? 'setToWinning' : 'setToLosing', args: { idea_id: id } });
  };

  return (
    <FormControlLabel
      control={<Switch checked={defaultValue} onChange={toggleWinner} />}
      label={t('settings.is_winner')}
      sx={{ order: 5, mb: 3 }}
    />
  );
};
export default SetWinnerField;
