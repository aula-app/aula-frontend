import { Stack } from '@mui/material';
import CustomFields from './CustomFields';
import QuorumSettings from './QuorumSettings';
import { InstanceResponse } from '@/types/Generics';
import Categories from '../Categories';

interface Props {
  onReload: () => void | Promise<void>;
}

/** * Renders "IdeaSettings" component
 */

const IdeaSettings = ({ onReload }: Props) => {
  return (
    <Stack gap={2}>
      <Categories />
    </Stack>
  );
};

export default IdeaSettings;
