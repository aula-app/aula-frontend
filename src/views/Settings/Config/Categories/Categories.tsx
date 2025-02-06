import { AppIcon } from '@/components';
import { CAT_ICONS } from '@/components/AppIcon/AppIcon';
import { CategoryType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import { Chip, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const CatView = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedItem, setItem] = useState<CategoryType>();
  const [editCat, setEditCat] = useState(false);
  const [deleteCat, setDeleteCat] = useState(false);

  const categoriesFetch = async () =>
    await databaseRequest({
      model: 'Idea',
      method: 'getCategories',
      arguments: {},
    }).then((response) => {
      if (response.data) setCategories(response.data ? response.data : []);
    });

  const setDelete = (item: CategoryType) => {
    setItem(item);
    setDeleteCat(true);
  };

  const setEdit = (item?: CategoryType) => {
    setItem(item || undefined);
    setEditCat(true);
  };

  const onClose = () => {
    setItem(undefined);
    setEditCat(false);
    setDeleteCat(false);
    categoriesFetch();
  };

  useEffect(() => {
    categoriesFetch();
  }, []);

  return (
    <Stack pb={3}>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        <Chip
          label={t('actions.add', { var: t('scopes.category.name') })}
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
              onClick={() => setEdit(category)}
              onDelete={() => setDelete(category)}
            />
          );
        })}
      </Stack>
      {/* <EditData scope="categories" item={selectedItem} isOpen={!!editCat} onClose={onClose} />
      <DeleteData scope="categories" id={Number(selectedItem?.id)} isOpen={!!deleteCat} onClose={onClose} /> */}
    </Stack>
  );
};

export default CatView;
