import { addAnnouncement, AnnouncementArguments, editAnnouncement } from '@/services/announcements';
import { addMessage, editMessage } from '@/services/messages';
import { AnnouncementType, MessageType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { ConsentField, MarkdownEditor, StatusField } from '../DataFields';
import GroupField from '../DataFields/GroupField';
import UserField from '../DataFields/UserField';

/**
 * AnnouncementForms component is used to create or edit an idea.
 *
 * @component
 */

interface AnnouncementFormsProps {
  onClose: () => void;
  defaultValues?: AnnouncementType | MessageType;
}

const toOptions = [
  { name: 'all', label: 'ui.common.all' },
  { name: 'target_id', label: 'scopes.users.name' },
  { name: 'target_group', label: 'scopes.groups.name' },
] as const;

type MessageToType = 0 | 1 | 2; // Corresponds to the indices of `toOptions`

const AnnouncementForms: React.FC<AnnouncementFormsProps> = ({ defaultValues, onClose }) => {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState<MessageToType>(0);

  const schema = yup.object().shape({
    headline: yup.string().required(t('forms.validation.required')),
    body: yup.string().required(t('forms.validation.required')),
    user_needs_to_consent: yup.number(),
    consent_text: yup.string(),
    status: yup.number(),
    target_group: yup.number(),
    target_id: yup.number(),
  } as Record<keyof AnnouncementArguments, any>);

  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { headline: defaultValues ? ' ' : '' },
  });

  // Infer TypeScript type from the Yup schema
  type SchemaType = yup.InferType<typeof schema>;

  const onSubmit = async (data: SchemaType) => {
    try {
      setIsLoading(true);
      if (!defaultValues) {
        messageType === 0 ? await newAnnouncement(data) : await newMessage(data);
      } else {
        'user_needs_to_consent' in defaultValues ? await updateAnnouncement(data) : await updateMessage(data);
      }
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const newAnnouncement = async (data: SchemaType) => {
    const request = await addAnnouncement({
      headline: data.headline,
      body: data.body,
      user_needs_to_consent: data.user_needs_to_consent,
      consent_text: data.consent_text,
      status: data.status,
    });
    if (!request.error) onClose();
  };

  const updateAnnouncement = async (data: SchemaType) => {
    if (!defaultValues?.hash_id) return;
    const request = await editAnnouncement({
      text_id: defaultValues.hash_id,
      headline: data.headline,
      body: data.body,
      user_needs_to_consent: data.user_needs_to_consent,
      consent_text: data.consent_text,
      status: data.status,
    });
    if (!request.error) onClose();
  };

  const newMessage = async (data: SchemaType) => {
    const request = await addMessage({
      headline: data.headline,
      body: data.body,
      status: data.status,
      msg_type: 2,
    });
    if (!request.error) onClose();
  };

  const updateMessage = async (data: SchemaType) => {
    if (!defaultValues || 'user_needs_to_consent' in defaultValues || !defaultValues?.hash_id) return;
    const request = await editMessage({
      message_id: defaultValues.id,
      headline: data.headline,
      body: data.body,
      status: data.status,
      msg_type: defaultValues.msg_type,
    });
    if (!request.error) onClose();
  };

  useEffect(() => {
    reset({ ...defaultValues });
  }, [JSON.stringify(defaultValues)]);

  type TargetType = 'target_group' | 'target_id';

  return (
    <Stack p={2} overflow="auto">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack gap={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h1">
              {t(`actions.${defaultValues ? 'edit' : 'add'}`, { var: t(`scopes.announcements.name`).toLowerCase() })}
            </Typography>
            {checkPermissions('announcements', 'status') && <StatusField control={control} />}
          </Stack>

          <Stack gap={2}>
            <Stack direction="row" gap={2}>
              <TextField
                select
                label={t('settings.messages.to')}
                value={messageType}
                onChange={(e) => setMessageType(Number(e.target.value) as MessageToType)}
                sx={{ minWidth: 150 }}
              >
                {toOptions.map((option, index) => (
                  <MenuItem value={index} key={index}>
                    {t(option.label)}
                  </MenuItem>
                ))}
              </TextField>
              {(() => {
                switch (messageType) {
                  case 0:
                    return <ConsentField control={control} required />;
                  case 1:
                    return (
                      <UserField
                        defaultValue={(defaultValues && 'target_id' in defaultValues && defaultValues.target_id) || 0}
                        onChange={() => {}}
                        required
                      />
                    );
                  case 2:
                    return (
                      <GroupField
                        defaultValue={
                          (defaultValues && 'target_group' in defaultValues && defaultValues.target_group) || 0
                        }
                        onChange={() => {}}
                        required
                      />
                    );
                  default:
                    return null;
                }
              })()}
            </Stack>
            <TextField
              required
              label={t('settings.columns.headline')}
              error={!!errors.headline}
              helperText={`${errors.headline?.message || ''}`}
              fullWidth
              {...register('headline')}
            />
            <MarkdownEditor name="body" control={control} required />
          </Stack>
          <Stack direction="row" justifyContent="end" gap={2}>
            <Button onClick={onClose} color="error">
              {t('actions.cancel')}
            </Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {t('actions.confirm')}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
};

export default AnnouncementForms;
