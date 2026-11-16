import { Stack } from '@mui/material';
import { FC } from 'react';
import Categories from '../Categories';

interface Props {
  onReload: () => void | Promise<void>;
}

/** * Renders "IdeaSettings" component
 */

const IdeaSettings: FC<Props> = () => {
  return (
    <Stack gap={2}>
      <Categories />
    </Stack>
  );
};

export default IdeaSettings;
