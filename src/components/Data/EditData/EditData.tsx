import { Box, Button, Drawer, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormContainer } from 'react-hook-form-mui';
import FormField from '../FormField';
import DataConfig, { InputSettings } from './DataConfig';
import { RoomPhases, SettingNamesType } from '@/types/SettingsTypes';
import { checkPermissions, databaseRequest, scopeDefinitions } from '@/utils';
import { useEffect, useState } from 'react';
import { ObjectPropByName, SingleResponseType } from '@/types/Generics';
import DataUpdates from './DataUpdates';
import { useParams } from 'react-router-dom';

interface Props {
  id?: number;
  scope: SettingNamesType;
  otherData?: ObjectPropByName;
  metadata?: ObjectPropByName;
  isOpen: boolean;
  onClose: () => void;
}

export interface updateType {
  model: string;
  method: string;
  args: ObjectPropByName;
  requestId?: SettingNamesType;
}

/**
 * Renders "EditData" component
 */
const EditData = ({ id, scope, otherData = {}, metadata, isOpen, onClose }: Props) => {
  const { t } = useTranslation();
  const params = useParams();

  const [phase, setPhase] = useState<RoomPhases>((Number(params['phase']) as RoomPhases) || 0);
  const [fieldValues, setFieldValues] = useState<SingleResponseType>();
  const [updates, setUpdate] = useState<Array<updateType>>([]);

  const schema = getSchema().reduce((schema, field) => {
    return {
      ...schema,
      [field.name]: field.required ? field.form.schema?.required(t('validation.required')) : field.form.schema,
    };
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

  const clearValues = () => {
    setFieldValues(undefined);
    updateValues();
  };

  function getFields() {
    return DataConfig[scope]
      .filter((field) => checkPermissions(field.role))
      .filter((field) => !field.phase || field.phase <= phase);
  }

  function getSchema() {
    const newSchema = [] as InputSettings[];
    DataConfig[scope]
      .filter((field) => checkPermissions(field.role))
      .filter((field) => !field.phase || field.phase <= phase)
      .forEach((field) => {
        Array.isArray(field.name)
          ? field.name.forEach((name) =>
              newSchema.push({
                name: name,
                form: field.form,
                required: field.required,
                role: field.role,
              })
            )
          : newSchema.push(field);
      });
    return newSchema;
  }

  const getFieldValues = async () => {
    if (!scope) return;
    await databaseRequest({
      model: scopeDefinitions[scope].model,
      method: scopeDefinitions[scope].get,
      arguments: {
        [scopeDefinitions[scope].id]: id,
      },
    }).then((response: SingleResponseType) => {
      if (!response.success) return;
      if (scope === 'boxes') setPhase(Number(response.data.phase_id) as RoomPhases);
      setFieldValues(response);
    });
  };

  const getIdeaPhase = async () => {
    if (!fieldValues) return;
    await databaseRequest({
      model: 'Idea',
      method: 'getIdeaTopic',
      arguments: {
        idea_id: fieldValues.data.id,
      },
    }).then(async (response) => {
      if (!response.success) return;
      await databaseRequest({
        model: 'Topic',
        method: 'getTopicPhase',
        arguments: {
          topic_id: response.data,
        },
      }).then((response) => {
        if (!response.success) return;
        setPhase(response.data);
      });
    });
  };

  const updateValues = () => {
    getSchema().forEach((field) => {
      const defautltValue = params[field.name] || field.form.defaultValue;
      setValue(
        // @ts-ignore
        field.name,
        fieldValues && fieldValues.data[field.name] ? fieldValues.data[field.name] : defautltValue
      );
    });
    setUpdate([]);
  };

  const addUpdate = (newUpdate: updateType | updateType[]) => {
    if (!Array.isArray(newUpdate)) newUpdate = [newUpdate];
    setUpdate([...newUpdate, ...updates]);
  };

  const dataSave = async (args: ObjectPropByName) => {
    const requestId = ['updater_id'];

    if (['ideas', 'comments'].includes(scope) && !id) requestId.push('user_id');
    if (scope === 'messages' && !id) requestId.push('creator_id');
    if (metadata && args.body) args['body'] = JSON.stringify({ data: metadata, content: args['body'] });

    await databaseRequest(
      {
        model: scopeDefinitions[scope].model,
        method: !id ? scopeDefinitions[scope].add : scopeDefinitions[scope].edit,
        arguments: args,
      },
      requestId
    ).then((response) => {
      if (!response.success) return;
      updates.forEach((update) => {
        if (update.requestId) update.args[scopeDefinitions[scope].id] = response.data;
        if (!(scopeDefinitions[scope].id in update.args)) update.args[scopeDefinitions[scope].id] = response.data;
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
    if (typeof id !== 'undefined') otherData[scopeDefinitions[scope].id] = id;
    dataSave({
      ...formData,
      ...otherData,
    });
  };

  useEffect(() => {
    updateValues();
    if (scope === 'ideas') getIdeaPhase();
  }, [fieldValues]);

  useEffect(() => {
    id ? getFieldValues() : clearValues();
  }, [isOpen]);

  return (
    <Drawer anchor="bottom" open={isOpen} onClose={onClose} sx={{ overflowY: 'auto' }} key={scope}>
      <Stack p={2} overflow="auto">
        <Typography variant="h4" pb={2}>
          {t(`texts.${id ? 'edit' : 'add'}`, { var: t(`views.${scopeDefinitions[scope].name.toLowerCase()}`) })}
        </Typography>
        <FormContainer>
          <Stack>
            {getFields() &&
              getFields().map((field, key) => (
                <Box order={key} key={key}>
                  <FormField
                    data={field}
                    register={register}
                    control={control}
                    getValues={getValues}
                    setValue={setValue}
                    errors={errors}
                    phase={phase}
                  />
                </Box>
              ))}

            <DataUpdates
              id={id}
              phase={phase}
              scope={scope}
              defaultValue={
                scope === 'ideas'
                  ? !!fieldValues?.data.is_winner
                  : scope === 'users'
                    ? fieldValues?.data.email
                    : undefined
              }
              addUpdate={addUpdate}
            />
          </Stack>
        </FormContainer>
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
