import AppIcon from '@/components/AppIcon';
import { CategoryIconType } from '@/components/AppIcon/AppIcon';
import { ObjectPropByName } from '@/types/Generics';
import { databaseRequest, SelectOptionsType } from '@/utils';
import { MenuItem, Select, SelectChangeEvent, Stack, TextField } from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  id: number;
  disabled?: boolean;
  setUpdate: Dispatch<
    SetStateAction<
      {
        model: string;
        method: string;
        args: ObjectPropByName;
      }[]
    >
  >;
};

interface ThisOptionsType extends SelectOptionsType {
  icon: CategoryIconType;
}

/**
 * Renders "CategoryField" component
 */

const CategoryField = ({ id, disabled = false, setUpdate, ...restOfProps }: Props) => {
  const { t } = useTranslation();
  const [currentOptions, setOptions] = useState<ThisOptionsType[]>([]);
  const [selected, setSelected] = useState(0);

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
      if (!response.success) return;
      setSelected(Number(response.data.id));
    });
  }

  const changeCategory = (e: SelectChangeEvent) => {
    setSelected(Number(e.target.value));
  };

  useEffect(() => {
    setUpdate([{ model: 'Idea', method: 'addIdeaToCategory', args: { idea_id: id, category_id: selected } }]);
  }, [selected]);

  useEffect(() => {
    fetchOptions();
    getCategory();
  }, []);

  return (
    <Select
      label={t(`views.category`)}
      disabled={disabled}
      fullWidth
      value={String(selected)}
      onChange={changeCategory}
      sx={{ mb: 2 }}
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
    </Select>
  );
};
export default CategoryField;
