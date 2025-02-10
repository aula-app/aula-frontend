import AppIcon from '@/components/AppIcon';
import { getCategories, setCategory } from '@/services/categories';
import { CategoryType } from '@/types/Scopes';
import {
  Button,
  ButtonProps,
  Checkbox,
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
  useTheme,
} from '@mui/material';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props extends ButtonProps {
  ideas?: string[];
}

/**
 * Interface that will be exposed to the parent component.
 */
export interface AddRoomRefProps {
  setNewIdeaCategory: (id: string) => void;
}

const AddCategoryButton = forwardRef<AddRoomRefProps, Props>(
  ({ ideas = [], disabled = false, ...restOfProps }, ref) => {
    const { t } = useTranslation();
    const theme = useTheme();

    const [open, setOpen] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number>();
    const [update, setUpdate] = useState<number>();

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
      if (category.data) setSelectedCategory(category.data[0].id);
    };

    const toggleCategory = (id: number) => {
      if (selectedCategory !== id) {
        setSelectedCategory(id);
      } else {
        setSelectedCategory(undefined);
      }
    };

    const setNewIdeaCategory = async (id: string) => {
      if (!selectedCategory) return;
      setCategory(id, selectedCategory);
      onReset();
    };

    useImperativeHandle(ref, () => ({
      setNewIdeaCategory,
    }));

    const onSubmit = () => {
      setOpen(false);
      if (ideas.length === 1) setNewIdeaCategory(ideas[0]);
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
      if (open) onReset();
    }, [open, JSON.stringify(ideas)]);

    return (
      <>
        <Button variant="outlined" color="secondary" onClick={() => setOpen(true)} {...restOfProps}>
          <AppIcon icon="add" pr={2} />
          {t('actions.addToParent', {
            var: t('scopes.categories.name'),
          })}
        </Button>
        <Dialog onClose={onClose} open={open}>
          <DialogTitle>
            {t('actions.addToParent', {
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
                sx={{ bgcolor: category.id === selectedCategory ? 'disabled.main' : 'inherit' }}
              >
                <ListItemButton onClick={() => toggleCategory(category.id)}>
                  <ListItemAvatar>
                    <AppIcon icon={category.description_internal} />
                  </ListItemAvatar>
                  <ListItemText primary={category.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <DialogActions>
            <Button onClick={onClose} color="secondary" autoFocus>
              {t('actions.cancel')}
            </Button>
            <Button onClick={onSubmit} variant="contained">
              {t('actions.confirm')}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
);

export default AddCategoryButton;
