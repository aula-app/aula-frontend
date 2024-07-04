import { SettingsConfig } from '@/utils';
import * as yup from 'yup';
import { Button, Stack } from '@mui/material';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { yupResolver } from '@hookform/resolvers/yup';
import FormInput from './FormInput';
import { EditDataType, SingleResponseType } from '@/types/Generics';
import { useEffect } from 'react';

type Props = {
  info: EditDataType;
  items: SingleResponseType;
  onClose: () => void;
  onSubmit: (formData: Object) => Promise<void>;
};

/**
 * Renders "DataFeilds" component
 */

const DataFields = ({ info, items, onClose, onSubmit }: Props) => {
  const forms = ['edit', 'add'].includes(info.type)
    ? SettingsConfig[info.element].forms
    : SettingsConfig[info.type === 'report' ? 'report' : 'bug'].forms;
  const schema = forms.reduce((schema, form) => ({ ...schema, [form.column]: form.schema }), {});
  const {
    register,
    setValue,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(yup.object(schema).required()),
  });

  const updateValues = () => {
    SettingsConfig[info.element].forms.forEach((field) => {
      // @ts-ignore
      setValue(field.column, !!items && items.data && info.type !== 'add' ? items.data[field.column] : field.value);
    });
  };

  useEffect(() => {
    if (['edit', 'add'].includes(info.type)) updateValues();
  }, [info.id, items.data]);

  return (
    // @ts-ignore
    <FormContainer onSuccess={handleSubmit(onSubmit)}>
      {forms.map((field) => (
        <FormInput
          key={field.column}
          content={field}
          register={register}
          control={control}
          getValues={getValues}
          errors={errors}
        />
      ))}
      <Stack direction="row">
        <Button color="error" sx={{ ml: 'auto', mr: 2 }} onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </Stack>
    </FormContainer>
  );
};

export default DataFields;
