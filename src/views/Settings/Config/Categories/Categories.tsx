import { AppIcon } from '@/components';
import { CAT_ICONS } from '@/components/AppIcon/AppIcon';
import { CategoryType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import { WarningAmber } from '@mui/icons-material';
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const CatView = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [editCat, setEditCat] = useState(false);
  const [deleteCat, setDeleteCat] = useState<CategoryType>();

  const categoriesFetch = async () =>
    await databaseRequest({
      model: 'Idea',
      method: 'getCategories',
      arguments: {},
    }).then((response) => {
      if (response.data) setCategories(response.data ? response.data : []);
    });

  const setEdit = (item?: CategoryType) => {
    setEditCat(true);
  };

  const onDelete = async () => {};

  const onClose = () => {
    setEditCat(false);
    setDeleteCat(undefined);
    categoriesFetch();
  };

  useEffect(() => {
    categoriesFetch();
  }, []);

  return (
    <Stack pb={3}>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        <Chip
          label={t('actions.add', { var: t('scopes.categories.name') })}
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
              onDelete={() => setDeleteCat(category)}
            />
          );
        })}
      </Stack>
      {/* <EditData scope="categories" item={selectedItem} isOpen={!!editCat} onClose={onClose} />
      <DeleteData scope="categories" id={Number(selectedItem?.id)} isOpen={!!deleteCat} onClose={onClose} /> */}
      <Dialog
        open={!!deleteCat}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Stack direction="row" alignItems="center">
            <WarningAmber sx={{ mr: 1 }} color="error" /> {t('deletion.headline', { var: t(`scopes.categories.name`) })}
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ overflowY: 'auto' }}>
          <DialogContentText id="alert-dialog-description">
            {t('deletion.confirm', { var: t(`scopes.categories.name`) })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteCat(undefined)} color="secondary" autoFocus>
            {t('actions.cancel')}
          </Button>
          <Button onClick={onDelete} color="error" variant="contained">
            {t('actions.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default CatView;
