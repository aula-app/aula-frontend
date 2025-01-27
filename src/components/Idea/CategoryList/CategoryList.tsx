import AppIcon from '@/components/AppIcon';
import { getCategories } from '@/services/categories';
import { CategoryType, IdeaType } from '@/types/Scopes';
import { Chip, Stack } from '@mui/material';
import { useEffect, useState } from 'react';

interface Props {
  idea: IdeaType;
}

const LikeButton: React.FC<Props> = ({ idea }) => {
  const [category, setCategory] = useState<CategoryType>();

  const getCategory = async () => {
    const result = await getCategories(idea.hash_id);
    if (result.data) setCategory(result.data);
  };

  useEffect(() => {
    getCategory();
  }, []);

  return category ? (
    <Stack direction="row" justifyContent="end" mx={-1}>
      <Chip
        icon={<AppIcon icon={category.description_internal} size="xs" sx={{ ml: 0.5 }} />}
        label={category.name}
        variant="filled"
      />
    </Stack>
  ) : null;
};

export default LikeButton;
