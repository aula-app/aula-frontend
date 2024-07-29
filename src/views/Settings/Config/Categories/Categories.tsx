import { AppIcon } from '@/components';
import AlterData from '@/components/AlterData';
import { CAT_ICONS } from '@/components/AppIcon/AppIcon';
import DeleteData from '@/components/DeleteData';
import { CategoryType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import { Box, Chip, Stack } from '@mui/material';
import { useEffect, useState } from 'react';

const CatView = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedId, setId] = useState<number | undefined>();
  const [editCat, setEditCat] = useState(false);
  const [deleteCat, setDeleteCat] = useState(false);

  const categoriesFetch = async () =>
    await databaseRequest({
      model: 'Idea',
      method: 'getCategories',
      arguments: {},
    }).then((response) => {
      if (response.success) setCategories(response.data ? response.data : []);
    });

  const setDelete = (id: number) => {
    setId(id);
    setDeleteCat(true);
  };

  const setEdit = (id?: number) => {
    setId(id || undefined);
    setEditCat(true);
  };

  const onClose = () => {
    setId(undefined);
    setEditCat(false);
    setDeleteCat(false);
    categoriesFetch();
  };

  useEffect(() => {
    categoriesFetch();
  }, []);

  return (
    <Stack>
      <Box>
        {categories.map((category, key) => {
          const currentIcon = category.description_internal as keyof typeof CAT_ICONS;
          return (
            <Chip
              key={key}
              label={category.name}
              avatar={<AppIcon icon={currentIcon} />}
              // onClick={() => setEdit(category.id)}
              onDelete={() => setDelete(category.id)}
              sx={{ mr: 1, mt: 1 }}
            />
          );
        })}
        <Chip label="New Category" avatar={<AppIcon icon="add" />} onClick={() => setEdit()} sx={{ mt: 1 }} />
      </Box>
      <AlterData scope="categories" id={selectedId} isOpen={!!editCat} onClose={onClose} />
      <DeleteData scope="categories" id={selectedId || 0} isOpen={!!deleteCat} onClose={onClose} />
    </Stack>
  );
};

export default CatView;
