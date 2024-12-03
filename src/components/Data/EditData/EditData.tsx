import { ObjectPropByName, SingleResponseType } from '@/types/Generics';
import { RoomPhases, SettingNamesType } from '@/types/SettingsTypes';
import { checkPermissions, databaseRequest } from '@/utils';
import DataConfig from '@/utils/Data';
import { InputSettings } from '@/utils/Data/formDefaults';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Drawer, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormContainer } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';
import DataUpdates from './DataUpdates';
import FormField from './FormField';
import { BoxType, IdeaType, PossibleFields, ScopeType, UserType } from '@/types/Scopes';

interface Props {
  item?: Partial<ScopeType>;
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

type FormValues = Record<string, any>;

/**
 * Renders "EditData" component
 */
const EditData = ({ item, scope, otherData = {}, metadata, isOpen, onClose }: Props) => {
  const { t } = useTranslation();
  const params = useParams();

  const [phase, setPhase] = useState<RoomPhases>((Number(params['phase']) as RoomPhases) || 0);
  const [updates, setUpdate] = useState<Array<updateType>>([]);

  const schema = getSchema().reduce((schema, field) => {
    const name = field.name as keyof PossibleFields;
    return {
      ...schema,
      [name]: field.required ? field.form.schema?.required('validation.required') : field.form.schema,
    };
  }, {});

  const { control, getValues, handleSubmit, register, setValue, setError, clearErrors, watch } = useForm<FormValues>({
    resolver: yupResolver(yup.object(schema)),
  });

  const clearValues = () => {
    updateValues();
  };

  function getFields() {
    return DataConfig[scope].fields
      .filter((field) => checkPermissions(field.role))
      .filter((field) => !('phase' in field) || ('phase' in field && field.phase && field.phase <= phase));
  }

  function getSchema() {
    const newSchema = [] as InputSettings[];
    DataConfig[scope].fields
      .filter((field) => checkPermissions(field.role))
      .filter((field) => !('phase' in field) || ('phase' in field && field.phase && field.phase <= phase))
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

  const getIdeaPhase = async () => {
    if (!item) return;
    await databaseRequest({
      model: 'Idea',
      method: 'getIdeaTopic',
      arguments: {
        idea_id: item.id,
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
        if (response.success) setPhase(response.data);
      });
    });
  };

  const getDefaultRoomDurations = async (room_id: number) => {
    if (!room_id) return;
    await databaseRequest({
      model: 'Room',
      method: 'getRoomBaseData',
      arguments: {
        room_id: room_id,
      },
    }).then((response: SingleResponseType) => {
      if (!response.success || !response.data) return;
      Object.keys(response.data)
        .filter((field) => field.includes('phase_duration_'))
        .map((phase) => {
          if (getValues(phase)) return;
          setValue(phase, response.data[phase] || 0);
        });
    });
  };

  const updateValues = () => {
    getSchema().forEach((field) => {
      const name = typeof field.name === 'string' ? field.name : field.name[0];
      const defaultValue = params[name] || field.form.defaultValue;
      setValue(name, item ? (item as Record<string, any>)[name] || defaultValue : defaultValue);
    });
    setUpdate([]);
  };

  const addUpdate = (newUpdate: updateType | updateType[]) => {
    if (!Array.isArray(newUpdate)) newUpdate = [newUpdate];
    setUpdate([...newUpdate, ...updates]);
  };

  const dataSave = async (args: ObjectPropByName) => {
    const requestId = ['updater_id'];

    if (['ideas', 'comments'].includes(scope) && !item) requestId.push('user_id');
    if (scope === 'messages' && !item) requestId.push('creator_id');
    if (metadata && args.body) args['body'] = JSON.stringify({ data: metadata, content: args['body'] });

    await databaseRequest(
      {
        model: DataConfig[scope].requests.model,
        method: !item ? DataConfig[scope].requests.add : DataConfig[scope].requests.edit,
        arguments: args,
      },
      requestId
    ).then((response) => {
      if (!response.success || !response.data) return;
      updates.length > 0 ? dataUpdates(response.data) : onClose();
    });
  };

  const dataUpdates = async (newId: number) => {
    let updated = 0;
    updates.forEach((update) => {
      if (update.requestId || !update.args[DataConfig[scope].requests.id])
        update.args[DataConfig[scope].requests.id] = newId;

      databaseRequest(
        {
          model: update.model,
          method: update.method,
          arguments: {
            ...update.args,
          },
        },
        ['updater_id']
      ).then(() => {
        updated++;
        if (updated === updates.length) onClose();
      });
    });
  };

  const onSubmit = (formData: ObjectPropByName) => {
    if (item) otherData[DataConfig[scope].requests.id] = item.id;
    if (scope === 'messages') delete formData.undefined;
    dataSave({
      ...formData,
      ...otherData,
    });
  };

  useEffect(() => {
    updateValues();
    if (scope === 'ideas') getIdeaPhase();
    if (scope === 'boxes' && (item as Partial<BoxType>)?.room_id) {
      getDefaultRoomDurations(Number((item as Partial<BoxType>).room_id));
    }
  }, [JSON.stringify(item)]);

  // @ts-ignore
  const watchRoom = watch('room_id');

  useEffect(() => {
    if (scope === 'boxes') getDefaultRoomDurations(getValues('room_id'));
  }, [watchRoom]);

  useEffect(() => {
    if (scope === 'boxes' && otherData.room_id) getDefaultRoomDurations(otherData.room_id);
  }, [isOpen]);

  const getDefaultValue = () => {
    if (scope === 'ideas') {
      return !!(item as Partial<IdeaType>)?.is_winner;
    }
    if (scope === 'users') {
      return (item as Partial<UserType>)?.email;
    }
    return undefined;
  };

  return (
    <Drawer anchor="bottom" open={isOpen} onClose={onClose} sx={{ overflowY: 'auto' }} key={scope}>
      <Stack p={2} overflow="auto">
        <Typography variant="h4" pb={2}>
          {t(`texts.${item ? 'edit' : 'add'}`, { var: t(`views.${DataConfig[scope].requests.name}`) })}
        </Typography>
        <FormContainer>
          <Stack>
            {getFields() &&
              getFields().map((field, key) => (
                <Box order={key} key={key}>
                  <FormField
                    isNew={typeof item === 'undefined'}
                    control={control}
                    data={field}
                    phase={phase}
                    register={register}
                    setValue={setValue}
                    getValues={getValues}
                    setError={setError}
                    clearErrors={clearErrors}
                  />
                </Box>
              ))}

            <DataUpdates
              id={Number(item?.id)}
              phase={phase}
              scope={scope}
              defaultValue={getDefaultValue()}
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
