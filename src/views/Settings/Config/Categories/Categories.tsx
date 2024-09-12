import { AppIcon } from '@/components';
import { CAT_ICONS } from '@/components/AppIcon/AppIcon';
import { DeleteData } from '@/components/Data';
import EditData from '@/components/Data/EditData';
import { CategoryType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import { Chip, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const CatView = () => {
  const { t } = useTranslation();
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
    <Stack pt={2} pb={3}>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        <Chip
          label={t('generics.add', { var: t('views.category') })}
          avatar={<AppIcon icon="add" />}
          onClick={() => setEdit()}
        />
        {categories.map((category, key) => {
          const currentIcon = category.description_internal as keyof typeof CAT_ICONS;
          return (
            <Chip
              key={key}
              label={category.name}
              avatar={<AppIcon icon={currentIcon} />}
              onClick={() => setEdit(category.id)}
              onDelete={() => setDelete(category.id)}
            />
          );
        })}
      </Stack>
      <EditData scope="categories" id={selectedId} isOpen={!!editCat} onClose={onClose} />
      <DeleteData scope="categories" id={selectedId || 0} isOpen={!!deleteCat} onClose={onClose} />
    </Stack>
  );
};

export default CatView;
