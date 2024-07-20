import { ObjectPropByName, SingleResponseType } from '@/types/Generics';
import { SettingNamesType } from '@/types/SettingsTypes';
import { databaseRequest, dataSettings, formsSettings, getRequest, requestDefinitions } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Drawer, Stack, Typography } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import MoveData from '../MoveData';
import FormInput from './FormInput';

interface Props {
  id?: number;
  isOpen: boolean;
  scope: SettingNamesType;
  otherData?: ObjectPropByName;
  onClose: () => void;
}

/**
 * Renders "AlterData" component
 * url: /
 */
const AlterData = ({ id, scope, isOpen, otherData = {}, onClose }: Props) => {
  const { t } = useTranslation();
  const [items, setItems] = useState<SingleResponseType>();
  const [move, setMove] = useState<SettingNamesType>();

  const schema = dataSettings[scope].reduce((schema, field) => {
    return { ...schema, [field.name]: formsSettings[field.name].schema };
  }, {});

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

  const dataFetch = async () => {
    if (!scope) return;
    await databaseRequest({
      model: requestDefinitions[scope].model,
      method: getRequest(scope, 'get'),
      arguments: {
        [getRequest(scope, 'id')]: id,
      },
    }).then((response: SingleResponseType) => setItems(response));
  };

  const dataSave = async (args: ObjectPropByName) => {
    const requestId = ['updater_id'];
    if (scope === 'ideas') requestId.push('user_id');
    if (scope === 'comments' && !id) requestId.push('user_id');
    if (scope === 'messages' && !id) requestId.push('creator_id');
    await databaseRequest(
      {
        model: requestDefinitions[scope].model,
        method: getRequest(scope, !id ? 'add' : 'edit'),
        arguments: args,
      },
      requestId
    ).then((response) => {
      if (!response.success) return;
      onClose();
    });
  };

  const updateValues = () => {
    dataSettings[scope].forEach((field) => {
      setValue(
        // @ts-ignore
        field.name,
        items ? items.data[field.name] : otherData[field.name] || formsSettings[field.name].defaultValue
      );
    });
  };

  const clearValues = () => {
    setItems(undefined);
    updateValues();
  };

  const onSubmit = (formData: Object) => {
    if (typeof id !== 'undefined') otherData[getRequest(scope, 'id')] = id;
    dataSave({
      ...formData,
      ...otherData,
    });
  };

  const getChild = () => {
    const keys = Object.keys(requestDefinitions) as SettingNamesType[];
    return keys.filter((curScope: SettingNamesType) => requestDefinitions[curScope].isChild === scope);
  };

  useEffect(() => {
    updateValues();
  }, [items]);

  useEffect(() => {
    !id ? clearValues() : dataFetch();
  }, [isOpen]);

  return (
    <>
      <Drawer anchor="bottom" open={isOpen} onClose={onClose} sx={{ overflowY: 'auto' }} key={`${id}_${scope}`}>
        {scope && (
          <Stack p={2}>
            <Typography variant="h4" pb={2}>
              {!id ? 'New ' : 'Edit '}
              {requestDefinitions[scope].model === 'Topic' ? 'Box' : requestDefinitions[scope].model}
            </Typography>
            <FormContainer>
              {dataSettings[scope].map((field) => (
                <Fragment key={field.name}>
                  {field.name === 'phase_duration_1' && (
                    <Typography variant="h5" mb={1}>
                      {t('texts.phaseDuration')}
                    </Typography>
                  )}
                  <FormInput
                    form={field.name}
                    register={register}
                    control={control}
                    getValues={getValues}
                    errors={errors}
                  />
                </Fragment>
              ))}
              {getChild().length > 0 &&
                getChild().map((child) => (
                  <Button
                    fullWidth
                    variant="contained"
                    color="info"
                    key={child}
                    sx={{ mb: 3, display: scope === 'rooms' && child === 'boxes' ? 'none' : 'initial' }}
                    onClick={() => setMove(child)}
                  >
                    {t('texts.addChild', { var: child })}
                  </Button>
                ))}
              <Stack direction="row">
                <Button color="error" sx={{ ml: 'auto', mr: 2 }} onClick={onClose}>
                  {t('generics.cancel')}
                </Button>
                <Button type="submit" variant="contained" onClick={handleSubmit(onSubmit)}>
                  {t('generics.confirm')}
                </Button>
              </Stack>
            </FormContainer>
          </Stack>
        )}
      </Drawer>
      {getChild().length > 0 && (
        <MoveData parentId={id} scope={move || getChild()[0]} isOpen={!!move} onClose={() => setMove(undefined)} />
      )}
    </>
  );
};

export default AlterData;
