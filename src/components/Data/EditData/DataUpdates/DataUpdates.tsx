import { ObjectPropByName } from '@/types/Generics';
import { RoomPhases, SettingNamesType } from '@/types/SettingsTypes';
import MoveData from '../../MoveData';
import CategoryField from '../../FormField/fields/CategoryField';
import SetWinnerField from '../../FormField/fields/SetWinnerField';
import { useParams } from 'react-router-dom';

interface Props {
  id?: number;
  phase: RoomPhases;
  scope: SettingNamesType;
  addUpdate: (newUpdate: { model: string; method: string; args: ObjectPropByName }) => void;
}

/**
 * Renders "DataUpdates" component
 */
const DataUpdates = ({ id, phase, scope, addUpdate }: Props) => {
  const params = useParams();

  switch (scope) {
    case 'ideas':
      if (!id && 'box_id' in params)
        addUpdate({ model: 'Idea', method: 'addIdeaToTopic', args: { topic_id: params.box_id } });
      return (
        <>
          <CategoryField id={id} addUpdate={addUpdate} />
          {id && phase === 40 && <SetWinnerField id={id} addUpdate={addUpdate} />}
        </>
      );
    case 'rooms':
      return <MoveData parentId={id} scope="users" />;
    default:
      return <></>;
  }
};

export default DataUpdates;
