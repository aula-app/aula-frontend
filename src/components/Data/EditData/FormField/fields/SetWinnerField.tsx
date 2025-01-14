import { FormControlLabel, Switch } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { updateType } from '../../EditData';

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
  const [winner, setWinner] = useState(defaultValue);

  const toggleWinner = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWinner(event.target.checked);
  };

  useEffect(() => {
    addUpdate({ model: 'Idea', method: winner ? 'setToWinning' : 'setToLosing', args: { idea_id: id } });
  }, [winner]);

  return (
    <FormControlLabel
      control={<Switch checked={winner} onChange={toggleWinner} />}
      label={t('settings.columns.is_winner')}
      sx={{ order: 5, mb: 3 }}
    />
  );
};
export default SetWinnerField;
