import { addMessage, editMessage } from '@/services/messages';
import { StatusTypes } from '@/types/Generics';
import { MessageType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { MarkdownEditor, StatusField } from '../DataFields';
import GroupField from '../DataFields/GroupField';
import UserField from '../DataFields/UserField';

/**
 * MessageForms component is used to create or edit an idea.
 *
 * @component
 */

interface MessageFormsProps {
  onClose: () => void;
  defaultValues?: MessageType;
}

const toOptions = [
  { name: 'target_id', label: 'scopes.users.name' },
  { name: 'target_group', label: 'scopes.groups.name' },
] as const;

type MessageToType = 0 | 1; // Corresponds to the indices of `toOptions`

const MessageForms: React.FC<MessageFormsProps> = ({ defaultValues, onClose }) => {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState<MessageToType>(0);

  const schema = yup.object().shape({
    headline: yup.string().required(t('forms.validation.required')),
    body: yup.string().required(t('forms.validation.required')),
    user_needs_to_consent: yup.number().optional(),
    consent_text: yup.string().optional(),
    status: yup.number().optional(),
    target_group: yup.lazy(() => {
      if (messageType === 1) {
        return yup.mixed().required();
      }
      return yup.mixed().notRequired();
    }),
    target_id: yup.lazy(() => {
      if (messageType === 0) {
        return yup.string().required();
      }
      return yup.string().notRequired();
    }),
  });

  const {
    register,
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      headline: defaultValues ? ' ' : '',
      target_id: defaultValues?.user_hash_id,
      target_group: defaultValues?.target_group,
      status: defaultValues?.status,
      body: defaultValues?.body || '',
    },
    mode: 'onChange',
  });

  // Infer TypeScript type from the Yup schema
  type SchemaType = yup.InferType<typeof schema>;

  const onSubmit = async (data: SchemaType) => {
    try {
      setIsLoading(true);
      if (!defaultValues) {
        messageType === 0 ? await newMessage(data) : await newMessage(data);
      } else {
        'user_needs_to_consent' in defaultValues ? await updateMessage(data) : await updateMessage(data);
      }
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const newMessage = async (data: SchemaType) => {
    const msgBody = {
      headline: data.headline,
      body: data.body,
      status: data.status as StatusTypes,
      msg_type: 2 as 2,
      target_id: messageType === 0 ? (data.target_id as string | null) : null,
      target_group: messageType === 1 ? (data.target_group as number | null) : null,
    };

    const request = await addMessage(msgBody);
    if (!request.error) onClose();
  };

  const updateMessage = async (data: SchemaType) => {
    if (!defaultValues || 'user_needs_to_consent' in defaultValues || !defaultValues?.hash_id) return;
    const request = await editMessage({
      message_id: defaultValues.id,
      headline: data.headline,
      body: data.body,
      status: data.status as StatusTypes,
      msg_type: defaultValues.msg_type,
      target_id: messageType === 0 ? (data.target_id as string | null) : null,
      target_group: messageType === 1 ? (data.target_group as number | null) : null,
    });
    if (!request.error) onClose();
  };

  const changeTarget = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newType = Number(event.target.value) as MessageToType;
    setMessageType(newType);
  };

  useEffect(() => {
    if (defaultValues) {
      const initialMessageType = 'target_id' in defaultValues && defaultValues.user_hash_id ? 0 : 1;
      setMessageType(initialMessageType);
      reset({
        headline: defaultValues.headline || '',
        body: defaultValues.body || '',
        status: defaultValues.status,
        target_id: 'target_id' in defaultValues ? defaultValues.user_hash_id : null,
        target_group: 'target_group' in defaultValues ? defaultValues.target_group : null,
      });
    }
  }, [JSON.stringify(defaultValues), reset]);

  return (
    <Stack p={2} overflow="auto">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack gap={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h1">
              {t(`actions.${defaultValues ? 'edit' : 'add'}`, { var: t(`scopes.messages.name`).toLowerCase() })}
            </Typography>
            {checkPermissions('messages', 'status') && <StatusField control={control} />}
          </Stack>

          <Stack gap={2}>
            <Stack direction="row" gap={2}>
              <TextField
                select
                label={t('settings.messages.to')}
                value={messageType}
                onChange={changeTarget}
                sx={{ minWidth: 150 }}
              >
                {toOptions.map((option, index) => (
                  <MenuItem value={index} key={index}>
                    {t(option.label)}
                  </MenuItem>
                ))}
              </TextField>
              {messageType === 0 ? <UserField control={control} /> : <GroupField control={control} />}
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

export default MessageForms;
