import { RoomPhases, SettingNamesType } from '@/types/SettingsTypes';
import { useParams } from 'react-router-dom';
import CategoryField from '../../FormField/fields/CategoryField';
import SetWinnerField from '../../FormField/fields/SetWinnerField';
import MoveData from '../../MoveData';
import { updateType } from '../EditData';
import ResetPassword from '../../FormField/fields/ResetPassword';

interface Props {
  id?: number;
  phase: RoomPhases;
  scope: SettingNamesType;
  defaultValue?: any;
  addUpdate: (newUpdate: updateType | updateType[]) => void;
}

/**
 * Renders "DataUpdates" component
 */
const DataUpdates = ({ id, phase, scope, defaultValue, addUpdate }: Props) => {
  const params = useParams();

  switch (scope) {
    case 'ideas':
      if (!id && 'box_id' in params)
        addUpdate({ model: 'Idea', method: 'addIdeaToTopic', args: { topic_id: params.box_id } });
      return (
        <>
          <CategoryField id={id} addUpdate={addUpdate} />
          {id && phase >= 40 && <SetWinnerField id={id} defaultValue={defaultValue} addUpdate={addUpdate} />}
        </>
      );
    case 'users':
      return (
        <>
          <MoveData id={id} scope={scope} addUpdate={addUpdate} />
          <ResetPassword order={4} email={defaultValue} />
        </>
      );
    case 'rooms':
      return <MoveData id={id} scope={scope} addUpdate={addUpdate} />;
    case 'boxes':
      return <MoveData id={id} scope={scope} addUpdate={addUpdate} />;
    default:
      return <></>;
  }
};

export default DataUpdates;
