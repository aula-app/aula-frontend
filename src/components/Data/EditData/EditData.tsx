import { Button, Drawer, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormContainer } from 'react-hook-form-mui';
import FormField from '../FormField';
import DataConfig from './DataConfig';
import { RoomPhases, SettingNamesType } from '@/types/SettingsTypes';
import { checkPermissions, databaseRequest, getRequest, requestDefinitions } from '@/utils';
import { useEffect, useState } from 'react';
import { ObjectPropByName, SingleResponseType } from '@/types/Generics';
import DataUpdates from './DataUpdates';

interface Props {
  id?: number;
  scope: SettingNamesType;
  phase?: RoomPhases;
  otherData?: ObjectPropByName;
  metadata?: ObjectPropByName;
  isOpen: boolean;
  onClose: () => void;
}

interface updateType {
  model: string;
  method: string;
  args: ObjectPropByName;
}

/**
 * Renders "EditData" component
 */
const EditData = ({ id, scope, phase = 0, otherData = {}, metadata, isOpen, onClose }: Props) => {
  const { t } = useTranslation();
  const schema = getFields().reduce((schema, field) => {
    return { ...schema, [field.name]: field.form.schema };
  }, {});

  const {
    register,
    setValue,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(yup.object(schema)),
  });

  const [fieldValues, setFieldValues] = useState<SingleResponseType>();
  const [update, setUpdate] = useState<Array<updateType>>([]);

  const clearValues = () => {
    setFieldValues(undefined);
    updateValues();
  };

  function getFields() {
    return DataConfig[scope]
      .filter((field) => checkPermissions(field.role))
      .filter((field) => !field.phase || field.phase <= phase);
  }

  const getFieldValues = async () => {
    if (!scope) return;
    await databaseRequest({
      model: requestDefinitions[scope].model,
      method: getRequest(scope, 'get'),
      arguments: {
        [getRequest(scope, 'id')]: id,
      },
    }).then((response: SingleResponseType) => {
      if (response.success) setFieldValues(response);
    });
  };

  const updateValues = () => {
    getFields().forEach((field) => {
      setValue(
        // @ts-ignore
        field.name,
        fieldValues ? fieldValues.data[field.name] : field.form.defaultValue
      );
    });
  };

  const addUpdate = (newUpdate: updateType) => {
    setUpdate([newUpdate, ...update]);
  };

  const dataSave = async (args: ObjectPropByName) => {
    const requestId = ['updater_id'];

    if (['ideas', 'comments'].includes(scope) && !id) requestId.push('user_id');
    if (scope === 'messages' && !id) requestId.push('creator_id');
    if (metadata && args.body) args['body'] = JSON.stringify({ data: metadata, content: args['body'] });

    await databaseRequest(
      {
        model: requestDefinitions[scope].model,
        method: getRequest(scope, !id ? 'add' : 'edit'),
        arguments: args,
      },
      requestId
    ).then((response) => {
      if (!response.success) return;
      update.forEach((update) => {
        if (!(getRequest(scope, 'id') in update.args)) update.args[getRequest(scope, 'id')] = response.data;
        databaseRequest(
          {
            model: update.model,
            method: update.method,
            arguments: {
              ...update.args,
            },
          },
          ['updater_id']
        );
      });
      onClose();
    });
  };

  const onSubmit = (formData: Object) => {
    if (typeof id !== 'undefined') otherData[getRequest(scope, 'id')] = id;
    dataSave({
      ...formData,
      ...otherData,
    });
  };

  useEffect(() => {
    updateValues();
  }, [fieldValues]);

  useEffect(() => {
    id ? getFieldValues() : clearValues();
  }, [isOpen]);

  return (
    <Drawer anchor="bottom" open={isOpen} onClose={onClose} sx={{ overflowY: 'auto' }} key={scope}>
      <Stack p={2} overflow="auto">
        <Typography variant="h4" pb={2}>
          {t(`texts.${id ? 'edit' : 'add'}`, { var: t(`views.${requestDefinitions[scope].item.toLowerCase()}`) })}
        </Typography>
        <FormContainer>
          {getFields() &&
            getFields().map((field) => (
              <FormField
                key={field.name}
                data={field}
                register={register}
                control={control}
                getValues={getValues}
                setValue={setValue}
                errors={errors}
              />
            ))}
        </FormContainer>
        <DataUpdates id={id} phase={phase} scope={scope} addUpdate={addUpdate} />
        <Stack direction="row">
          <Button color="error" sx={{ ml: 'auto', mr: 2 }} onClick={onClose}>
            {t('generics.cancel')}
          </Button>
          <Button type="submit" variant="contained" onClick={handleSubmit(onSubmit)}>
            {t('generics.confirm')}
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
};

export default EditData;
