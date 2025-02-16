import { AppIcon } from '@/components';
import { CAT_ICONS } from '@/components/AppIcon/AppIcon';
import CategoryForms from '@/components/DataForms/CategoryForms';
import { deleteCategory, getCategories } from '@/services/categories';
import { CategoryType } from '@/types/Scopes';
import { WarningAmber } from '@mui/icons-material';
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const CatView: React.FC = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [editCat, setEditCat] = useState<CategoryType | boolean>(false);
  const [deleteCat, setDeleteCat] = useState<CategoryType>();

  const categoriesFetch = async () => {
    const response = await getCategories();
    setCategories(response.data ? response.data : []);
  };

  const onDelete = async () => {
    if (!deleteCat) return;
    const request = await deleteCategory(deleteCat.id);
    if (request.error) return;
    onClose();
  };

  const onClose = () => {
    setEditCat(false);
    setDeleteCat(undefined);
    categoriesFetch();
  };

  useEffect(() => {
    categoriesFetch();
  }, []);

  return (
    <Stack gap={2}>
      <Typography variant="h6">{t('scopes.categories.plural')}</Typography>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        <Chip
          label={t('actions.add', { var: t('scopes.categories.name').toLowerCase() })}
          avatar={<AppIcon icon="add" />}
          onClick={() => setEditCat(true)}
        />
        {categories.map((category, key) => {
          const currentIcon = category.description_internal as keyof typeof CAT_ICONS;
          return (
            <Chip
              key={key}
              label={category.name}
              avatar={<AppIcon icon={currentIcon} />}
              onClick={() => setEditCat(category)}
              onDelete={() => setDeleteCat(category)}
            />
          );
        })}
      </Stack>
      <Drawer anchor="bottom" open={!!editCat} onClose={onClose} sx={{ overflowY: 'auto' }}>
        <CategoryForms onClose={onClose} defaultValues={typeof editCat !== 'boolean' ? editCat : undefined} />
      </Drawer>
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
