import AppIcon from '@/components/AppIcon';
import { CategoryIconType } from '@/components/AppIcon/AppIcon';
import { ObjectPropByName } from '@/types/Generics';
import { databaseRequest } from '@/utils';
import { MenuItem, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SelectOptionsType } from '@/utils/Data/formDefaults';
import { updateType } from '../../EditData';

type Props = {
  id?: number;
  disabled?: boolean;
  addUpdate: (newUpdate: updateType | updateType[]) => void;
};

interface ThisOptionsType extends SelectOptionsType {
  icon: CategoryIconType;
}

/**
 * Renders "CategoryField" component
 */

const CategoryField = ({ id, disabled = false, addUpdate, ...restOfProps }: Props) => {
  const { t } = useTranslation();
  const [currentOptions, setOptions] = useState<ThisOptionsType[]>([]);
  const [selected, setSelected] = useState(0);
  const [mounted, setMounted] = useState(false);

  async function fetchOptions() {
    await databaseRequest({
      model: 'Idea',
      method: 'getCategories',
      arguments: {},
    }).then((response) => {
      if (!response.success) return;
      setOptions(
        // @ts-ignore
        response.data.map((row) => {
          return { label: row.name, value: row.id, icon: row.description_internal as CategoryIconType };
        })
      );
    });
  }

  async function getCategory() {
    await databaseRequest({
      model: 'Idea',
      method: 'getIdeaCategory',
      arguments: {
        idea_id: id,
      },
    }).then((response) => {
      if (response.success && response.data) setSelected(Number(response.data.id));
      setMounted(true);
    });
  }

  const changeCategory = (e: any) => {
    setSelected(Number(e.target.value));
  };

  useEffect(() => {
    if (!mounted) return;
    const args = { category_id: selected } as ObjectPropByName;
    if (id) args['idea_id'] = id;
    addUpdate({ model: 'Idea', method: 'addIdeaToCategory', args: args });
  }, [selected]);

  useEffect(() => {
    fetchOptions();
    id ? getCategory() : setMounted(true);
  }, []);

  return (
    <TextField
      label={t(`scopes.category.name`)}
      disabled={disabled}
      fullWidth
      select
      value={selected}
      onChange={changeCategory}
      sx={{ mb: 3, order: 1 }}
      {...restOfProps}
    >
      {currentOptions.map((option) => (
        <MenuItem value={option.value} key={option.label}>
          <Stack direction="row">
            <AppIcon icon={option.icon} sx={{ mr: 1 }} />
            {option.label}
          </Stack>
        </MenuItem>
      ))}
    </TextField>
  );
};
export default CategoryField;
