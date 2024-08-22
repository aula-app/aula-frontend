import { ObjectPropByName, SingleResponseType } from '@/types/Generics';
import { RoomPhases, SettingNamesType } from '@/types/SettingsTypes';
import {
  checkPermissions,
  databaseRequest,
  dataSettings,
  formsSettings,
  getRequest,
  requestDefinitions,
} from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Drawer, Stack, Typography } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import FormInput from './FormInput';
import CategoryField from './FormInput/CategoryField';
import IconField from './FormInput/IconField';
import ImageField from './FormInput/ImageField';
import { useParams } from 'react-router-dom';
import SetWinnerField from './FormInput/SetWinnerField';

interface Props {
  id?: number;
  isOpen: boolean;
  scope: SettingNamesType;
  otherData?: ObjectPropByName;
  metadata?: ObjectPropByName;
  onClose: () => void;
}

interface updateType {
  model: string;
  method: string;
  args: ObjectPropByName;
}

/**
 * Renders "AlterData" component
 * url: /
 */
const AlterData = ({ id, scope, isOpen, otherData = {}, metadata, onClose }: Props) => {
  const { t } = useTranslation();
  const params = useParams();
  const [item, setItem] = useState<SingleResponseType>();
  const [phase, setPhase] = useState<RoomPhases>((params['phase'] as RoomPhases) || '0');
  const [update, setUpdate] = useState<Array<updateType>>([]);

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
    }).then((response: SingleResponseType) => setItem(response));
  };

  const dataSave = async (args: ObjectPropByName) => {
    const requestId = ['updater_id'];

    console.log(update);

    if (scope === 'ideas') requestId.push('user_id');
    if (scope === 'comments' && !id) requestId.push('user_id');
    if (scope === 'messages' && !id) requestId.push('creator_id');
    if (scope === 'users' && !id) args['password'] = 'default_password';
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
        ).then(() => onClose());
      });
      if (update.length === 0) onClose();
    });
  };

  const updateValues = () => {
    dataSettings[scope].forEach((field) => {
      setValue(
        // @ts-ignore
        field.name,
        item
          ? item.data[field.name] || formsSettings[field.name].defaultValue
          : otherData[field.name] || formsSettings[field.name].defaultValue
      );
    });
  };

  const addUpdate = (newUpdate: updateType) => {
    setUpdate([newUpdate, ...update]);
  };

  const clearValues = () => {
    setItem(undefined);
    updateValues();
  };

  const getIdeaPhase = async () => {
    if (!item) return;
    await databaseRequest({
      model: 'Topic',
      method: 'getTopicPhase',
      arguments: {
        topic_id: item.data.topic_id,
      },
    }).then((response) => setPhase(response.data));
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
    if (scope === 'ideas' && !params['phase']) getIdeaPhase();
  }, [item]);

  useEffect(() => {
    !id ? clearValues() : dataFetch();
    if (scope === 'ideas' && !id && 'box_id' in params)
      addUpdate({ model: 'Idea', method: 'addIdeaToTopic', args: { topic_id: params.box_id } });
  }, [isOpen]);

  return (
    <>
      <Drawer anchor="bottom" open={isOpen} onClose={onClose} sx={{ overflowY: 'auto' }} key={`${id}_${scope}`}>
        {scope && (
          <Stack p={2}>
            <Typography variant="h4" pb={2}>
              {t(`texts.${!id ? 'add' : 'edit'}`, { var: t(`views.${requestDefinitions[scope].item.toLowerCase()}`) })}
            </Typography>
            <FormContainer>
              {dataSettings[scope].map((field) => (
                <Fragment key={field.name}>
                  {checkPermissions(field.role) && (!field.phase || field.phase === Number(phase)) && (
                    <>
                      {field.name !== 'description_internal' ? (
                        <>
                          {field.name === 'phase_duration_1' && (
                            <Typography variant="h5" mb={1}>
                              {t('texts.phaseDuration')}
                            </Typography>
                          )}
                          {['bug', 'report'].includes(scope) && field.name !== 'headline' && (
                            <Typography mb={1}>{t(`texts.${scope}`)}</Typography>
                          )}
                          <FormInput
                            form={field.name}
                            register={register}
                            control={control}
                            getValues={getValues}
                            setValue={setValue}
                            errors={errors}
                            hidden={['bug', 'report'].includes(scope) && field.name === 'headline'}
                          />
                        </>
                      ) : scope === 'categories' ? (
                        <IconField form={field.name} control={control} setValue={setValue} />
                      ) : (
                        <ImageField form={field.name} control={control} setValue={setValue} />
                      )}
                    </>
                  )}
                </Fragment>
              ))}
              {scope === 'ideas' && <CategoryField id={id} addUpdate={addUpdate} />}
              {id && item && scope === 'ideas' && Number(phase) === 40 && (
                <SetWinnerField id={id} defaultValue={!!item.data.is_winner} addUpdate={addUpdate} />
              )}
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
    </>
  );
};

export default AlterData;
