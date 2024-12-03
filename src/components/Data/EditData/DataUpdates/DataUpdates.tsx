import { RoomPhases, SettingNamesType } from '@/types/SettingsTypes';
import { useParams } from 'react-router-dom';
import MoveData from '../../MoveData';
import { updateType } from '../EditData';
import CategoryField from '../FormField/fields/CategoryField';
import SetWinnerField from '../FormField/fields/SetWinnerField';
import ResetPassword from '../FormField/fields/ResetPassword';

interface Props {
  item?: Partial<ScopeType>;
  phase: RoomPhases;
  scope: SettingNamesType;
  defaultValue?: any;
  addUpdate: (newUpdate: updateType | updateType[]) => void;
}

/**
 * Renders "DataUpdates" component
 */
const DataUpdates = ({ item, phase, scope, defaultValue, addUpdate }: Props) => {
  const params = useParams();

  switch (scope) {
    case 'boxes':
      return <MoveData id={Number(item?.id)} scope={scope} addUpdate={addUpdate} />;
    case 'groups':
      return <MoveData id={Number(item?.id)} scope={scope} addUpdate={addUpdate} />;
    case 'ideas':
      if (!item && 'box_id' in params)
        addUpdate({ model: 'Idea', method: 'addIdeaToTopic', args: { topic_id: params.box_id } });
      return (
        <>
          <CategoryField id={Number(item?.id)} addUpdate={addUpdate} />
          {item && phase >= 40 && (
            <SetWinnerField id={Number(item.id)} defaultValue={defaultValue} addUpdate={addUpdate} />
          )}
        </>
      );
    case 'rooms':
      if ('room_name' in item && 'type' in item && Number(item.type) === 1) return; // prevent user removal from default room
      return <MoveData id={Number(item?.id)} scope={scope} addUpdate={addUpdate} />;
    case 'users':
      return (
        <>
          <MoveData id={Number(item?.id)} scope={scope} addUpdate={addUpdate} />
          {typeof item !== 'undefined' && Number(item.id) > 0 && <ResetPassword order={6} email={defaultValue} />}
        </>
      );
    default:
      return <></>;
  }
};

export default DataUpdates;
