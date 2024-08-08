import { ObjectPropByName } from '@/types/Generics';
import { FormControlLabel, Switch } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  id: number;
  defaultValue: boolean;
  setUpdate: Dispatch<
    SetStateAction<
      {
        model: string;
        method: string;
        args: ObjectPropByName;
      }[]
    >
  >;
};

/**
 * Renders "SetWinnerField" component
 */

const SetWinnerField = ({ id, defaultValue, setUpdate }: Props) => {
  const { t } = useTranslation();

  const toggleWinner = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdate([
      { model: 'Idea', method: event.target.checked ? 'setToWinning' : 'setToLosing', args: { idea_id: id } },
    ]);
  };

  return (
    <FormControlLabel
      control={<Switch defaultChecked={defaultValue} onChange={toggleWinner} />}
      label={t('settings.is_winner')}
    />
  );
};
export default SetWinnerField;
