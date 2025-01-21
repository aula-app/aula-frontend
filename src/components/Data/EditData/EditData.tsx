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

/**
 * Props interface for the EditData component
 * @interface Props
 * @property {Partial<ScopeType>} [item] - Optional item to edit. If not provided, component operates in 'add' mode
 * @property {SettingNamesType} scope - The type of data being edited (e.g., 'ideas', 'comments', 'messages')
 * @property {ObjectPropByName} [otherData] - Additional data to be included in the form submission
 * @property {ObjectPropByName} [metadata] - Metadata for the form, used particularly with message bodies
 * @property {boolean} isOpen - Controls the visibility of the drawer
 * @property {() => void} onClose - Callback function to close the drawer
 */
interface Props {
  item?: Partial<ScopeType>;
  scope: SettingNamesType;
  otherData?: ObjectPropByName;
  metadata?: ObjectPropByName;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Interface defining the structure of update operations
 * @interface updateType
 * @property {string} model - The data model to update
 * @property {string} method - The method to call on the model
 * @property {ObjectPropByName} args - Arguments for the update operation
 * @property {SettingNamesType} [requestId] - Optional request identifier
 */
export interface updateType {
  model: string;
  method: string;
  args: ObjectPropByName;
  requestId?: SettingNamesType;
}

/**
 * Type for form values, allowing any string key with any value
 */
type FormValues = Record<string, any>;

/**
 * EditData Component
 *
 * A reusable drawer component that provides form functionality for creating or editing various data types.
 * It supports dynamic form fields based on the scope, handles form validation, and manages data updates.
 *
 * @component
 * @param {Props} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const EditData = ({ item, scope, otherData = {}, metadata, isOpen, onClose }: Props) => {
  const { t } = useTranslation();
  const params = useParams();

  // State for tracking the current phase and pending updates
  const [phase, setPhase] = useState<RoomPhases>((Number(params['phase']) as RoomPhases) || 0);
  const [updates, setUpdate] = useState<Array<updateType>>([]);

  /**
   * Builds the validation schema based on field configurations
   */
  const schema = getSchema().reduce((schema, field) => {
    const name = field.name as keyof PossibleFields;
    return {
      ...schema,
      [name]: field.required ? field.form.schema?.required('validation.required') : field.form.schema,
    };
  }, {});

  // Initialize form with validation schema
  const { control, getValues, handleSubmit, register, setValue, setError, clearErrors, watch } = useForm<FormValues>({
    resolver: yupResolver(yup.object(schema)),
  });

  /**
   * Resets form values to their defaults or current item values
   */
  const clearValues = () => {
    updateValues();
  };

  /**
   * Retrieves fields based on user permissions and current phase
   * @returns {Array<InputSettings>} Filtered array of field configurations
   */
  function getFields() {
    return DataConfig[scope].fields
      .filter((field) => checkPermissions(field.role))
      .filter((field) => !('phase' in field) || ('phase' in field && field.phase && field.phase <= phase));
  }

  /**
   * Generates schema for form fields considering permissions and phases
   * @returns {Array<InputSettings>} Array of field schemas
   */
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

  /**
   * Fetches and sets the phase for an idea
   */
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

  /**
   * Fetches default room durations for a given room
   * @param {number} room_id - ID of the room
   */
  const getDefaultRoomDurations = async (room_id: number) => {
    if (item || !room_id) return;
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

  /**
   * Updates form values with current item data or defaults
   */
  const updateValues = () => {
    getSchema().forEach((field) => {
      const name = typeof field.name === 'string' ? field.name : field.name[0];
      const defaultValue = params[name] || field.form.defaultValue;
      setValue(name, item ? (item as Record<string, any>)[name] || defaultValue : defaultValue);
    });
    setUpdate([]);
  };

  /**
   * Adds new updates to the pending updates queue
   * @param {updateType | updateType[]} newUpdate - Update(s) to add
   */
  const addUpdate = (newUpdate: updateType | updateType[]) => {
    if (!Array.isArray(newUpdate)) newUpdate = [newUpdate];
    setUpdate([...newUpdate, ...updates]);
  };

  /**
   * Saves form data to the database
   * @param {ObjectPropByName} args - Form data to save
   */
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

  /**
   * Processes pending updates after main data save
   * @param {number} newId - ID of the newly created/updated item
   */
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

  /**
   * Form submission handler
   * @param {ObjectPropByName} formData - Form data to submit
   */
  const onSubmit = (formData: ObjectPropByName) => {
    if (item) otherData[DataConfig[scope].requests.id] = Number(item.id);
    if (scope === 'messages') delete formData.undefined;
    dataSave({
      ...formData,
      ...otherData,
    });
  };

  // Effect hooks for initialization and updates
  useEffect(() => {
    updateValues();
    if (scope === 'ideas') getIdeaPhase();
    if (scope === 'boxes' && (item as Partial<BoxType>)?.room_id) {
      getDefaultRoomDurations(Number((item as Partial<BoxType>).room_id));
    }
  }, [JSON.stringify(item)]);

  useEffect(() => {
    if (scope === 'boxes' && otherData.room_id) getDefaultRoomDurations(otherData.room_id);
  }, [isOpen]);

  /**
   * Gets default value based on scope and item type
   * @returns {boolean | string | undefined} Default value for the form
   */
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
              item={item}
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
