import { Stack } from '@mui/material';
import CustomFields from './CustomFields';
import QuorumSettings from './QuorumSettings';

interface Props {
  onReload: () => void | Promise<void>;
}

/** * Renders "IdeaSettings" component
 */

const IdeaSettings = ({ onReload }: Props) => {
  return (
    <Stack gap={2}>
      <QuorumSettings onReload={onReload} />
      <CustomFields onReload={onReload} />
    </Stack>
  );
};

export default IdeaSettings;
