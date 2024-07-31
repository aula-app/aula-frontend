import { ObjectPropByName, SingleResponseType } from '@/types/Generics';
import { SettingNamesType } from '@/types/SettingsTypes';
import {
  databaseRequest,
  dataSettings,
  formsSettings,
  getRequest,
  localStorageGet,
  parseJwt,
  requestDefinitions,
} from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Drawer, Stack, Typography } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import FormInput from './FormInput';
import IconField from './FormInput/IconField';
import ImageField from './FormInput/ImageField';
import CategoryField from './FormInput/CategoryField';

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
  const jwt_token = localStorageGet('token');
  const jwt_payload = parseJwt(jwt_token);
  const [items, setItems] = useState<SingleResponseType>();
  const [update, setUpdate] = useState<Array<{ model: string; method: string; args: ObjectPropByName }>>([]);

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
    if (scope === 'users' && !id) args['password'] = 'default_password';
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
              {t(`texts.${!id ? 'add' : 'edit'}`, { var: t(`views.${requestDefinitions[scope].item.toLowerCase()}`) })}
            </Typography>
            <FormContainer>
              {dataSettings[scope].map((field) => (
                <Fragment key={field.name}>
                  {jwt_payload.user_level >= field.role && (
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
              {scope === 'ideas' && id && <CategoryField id={id} setUpdate={setUpdate} />}
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
