import AppIcon from '@/components/AppIcon';
import { getCategories } from '@/services/categories';
import { CategoryType, IdeaType } from '@/types/Scopes';
import { Chip } from '@mui/material';
import { useEffect, useState } from 'react';

interface Props {
  idea: IdeaType;
}

const LikeButton: React.FC<Props> = ({ idea }) => {
  const [category, setCategory] = useState<CategoryType>();

  const getCategory = async () => {
    const result = await getCategories(idea.hash_id);
    if (result.data) setCategory(result.data[0]);
  };

  useEffect(() => {
    getCategory();
  }, []);

  return !!category ? (
    <Chip
      icon={<AppIcon icon={category.description_internal} size="xs" />}
      label={category.name}
      variant="filled"
      size="small"
      sx={{ ml: 1, mt: -0.5 }}
    />
  ) : null;
};

export default LikeButton;
