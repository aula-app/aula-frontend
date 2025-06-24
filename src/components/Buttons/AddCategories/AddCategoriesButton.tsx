import AppIcon from '@/components/AppIcon';
import { addIdeaCategory, getCategories, removeIdeaCategory } from '@/services/categories';
import { CategoryType } from '@/types/Scopes';
import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Skeleton,
  Typography,
} from '@mui/material';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props extends ButtonProps {
  ideas?: string[];
}

/**
 * Interface that will be exposed to the parent component.
 */
export interface AddCategoryRefProps {
  setNewIdeaCategory: (id: string) => void;
}

const AddCategoryButton = forwardRef<AddCategoryRefProps, Props>(
  ({ ideas = [], disabled = false, ...restOfProps }, ref) => {
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<CategoryType>();
    const [originalCategory, setOriginalCategory] = useState<CategoryType>();

    const fetchCategories = useCallback(async () => {
      setLoading(true);
      const response = await getCategories();
      setLoading(false);
      if (response.error) setError(response.error);
      if (!response.error && response.data) setCategories(response.data);
    }, []);

    const fetchIdeaCategory = async () => {
      if (ideas.length !== 1) return;

      const category = await getCategories(ideas[0]);
      if (!category.data) return;
      setSelectedCategory(category.data[0]);
      setOriginalCategory(category.data[0]);
    };

    const toggleCategory = (cat: CategoryType) => {
      if (selectedCategory?.id !== cat.id) {
        setSelectedCategory(cat);
      } else {
        setSelectedCategory(undefined);
      }
    };

    const setNewIdeaCategory = async (id: string) => {
      if (!selectedCategory && originalCategory) removeIdeaCategory(id, originalCategory.id);
      if (
        (selectedCategory && !originalCategory) ||
        (selectedCategory && originalCategory && selectedCategory.id !== originalCategory.id)
      )
        addIdeaCategory(id, selectedCategory.id);
      onReset();
    };

    useImperativeHandle(ref, () => ({
      setNewIdeaCategory,
    }));

    const onSubmit = () => {
      setOpen(false);
    };

    const onClose = () => {
      setOpen(false);
      setSelectedCategory(undefined);
    };

    const onReset = () => {
      fetchCategories();
      fetchIdeaCategory();
    };

    useEffect(() => {
      onReset();
    }, [JSON.stringify(ideas)]);

    return (
      <>
        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={() => setOpen(true)} 
          data-testid="add-category-button"
          aria-label={selectedCategory 
            ? t('actions.change', { var: selectedCategory.name })
            : t('actions.addToParent', { var: t('scopes.categories.name') })
          }
          aria-expanded={open}
          aria-haspopup="dialog"
          {...restOfProps}
        >
          <AppIcon icon={selectedCategory?.description_internal || 'add'} pr={2} />
          {selectedCategory
            ? selectedCategory.name
            : t('actions.addToParent', {
                var: t('scopes.categories.name'),
              })}
        </Button>
        <Dialog onClose={onClose} open={open} data-testid="add-category-dialog">
          <DialogTitle>
            {t(selectedCategory ? 'actions.change' : 'actions.addToParent', {
              var: t('scopes.categories.name'),
            })}
          </DialogTitle>
          {isLoading && <Skeleton />}
          {error && <Typography>{t(error)}</Typography>}
          <List sx={{ pt: 0 }}>
            {categories.map((category) => (
              <ListItem
                disablePadding
                key={category.id}
                sx={{ bgcolor: category.id === selectedCategory?.id ? 'disabled.main' : 'inherit' }}
              >
                <ListItemButton onClick={() => toggleCategory(category)}>
                  <ListItemAvatar>
                    <AppIcon icon={category.description_internal} />
                  </ListItemAvatar>
                  <ListItemText primary={category.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <DialogActions>
            <Button 
              onClick={onClose} 
              color="secondary" 
              autoFocus
              data-testid="cancel-category-button"
              aria-label={t('actions.cancel')}
            >
              {t('actions.cancel')}
            </Button>
            <Button 
              onClick={onSubmit} 
              variant="contained"
              data-testid="confirm-category-button"
              aria-label={t('actions.confirm')}
            >
              {t('actions.confirm')}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
);

export default AddCategoryButton;
