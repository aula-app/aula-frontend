import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Drawer, Stack, Typography } from '@mui/material';
import { databaseRequest, dataSettings, formsSettings, getRequest, requestDefinitions } from '@/utils';
import { SettingNamesType } from '@/types/scopes/SettingsTypes';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import FormInput from './FormInput';
import { useEffect, useState } from 'react';
import { ObjectPropByName, SingleResponseType } from '@/types/Generics';
import MoveData from '../MoveData';

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
  const [child, setChild] = useState<Record<SettingNamesType, number[]>>();

  const schema = dataSettings[scope].reduce(
    (schema, field) => ({ ...schema, [field]: formsSettings[field].schema }),
    {}
  );

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
      child ? moveChild(!id ? response.data : id) : onClose();
    });
  };

  const setMoveData = (response: number[]) => {
    if (!move) return;
    const newChildList = { ...child, [move]: response };
    setChild(newChildList);
    setMove(undefined);
  };

  const moveChild = async (parentId: number) => {
    if (!child) return;
    const childList = Object.keys(child) as SettingNamesType[];
    childList.map((childScope) => {
      child[childScope].map((childId) =>
        databaseRequest(
          {
            model: requestDefinitions[childScope].model,
            method: getRequest(childScope, 'move'),
            arguments: {
              [getRequest(scope, 'id')]: parentId,
              [getRequest(childScope, 'id')]: childId,
            },
          },
          ['updater_id']
        ).then(onClose)
      );
    });
  };

  const updateValues = () => {
    dataSettings[scope].forEach((field) => {
      // @ts-ignore
      setValue(field, items ? items.data[field] : otherData[field] || formsSettings[field].defaultValue);
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
                <FormInput
                  key={field}
                  form={field}
                  register={register}
                  control={control}
                  getValues={getValues}
                  errors={errors}
                />
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
        <MoveData
          scope={move || getChild()[0]}
          isOpen={!!move}
          onConfirm={(response: number[]) => setMoveData(response)}
          onClose={() => setMove(undefined)}
        />
      )}
    </>
  );
};

export default AlterData;
