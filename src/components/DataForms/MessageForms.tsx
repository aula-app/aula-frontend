import { addMessage, editMessage } from '@/services/messages';
import { StatusTypes } from '@/types/Generics';
import { MessageType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import { useDraftStorage } from '@/hooks';
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

  const form = useForm({
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

  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = form;

  // Infer TypeScript type from the Yup schema
  type SchemaType = yup.InferType<typeof schema>;

  const { handleSubmit: handleDraftSubmit, handleCancel } = useDraftStorage(form, {
    storageKey: 'message-form-draft-new',
    isNewRecord: !defaultValues,
    onCancel: onClose,
  });

  const onSubmit = async (data: SchemaType) => {
    try {
      setError('root', {});
      setIsLoading(true);
      let success = false;
      if (!defaultValues) {
        success = await newMessage(data);
      } else {
        success = await updateMessage(data);
      }
      if (success) {
        handleDraftSubmit();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const newMessage = async (data: SchemaType): Promise<boolean> => {
    let target_id: string | null = null;
    let target_group: number | null = null;

    switch (messageType) {
      case 0:
        target_id = data.target_id as string | null;
        break;
      case 1:
        target_group = data.target_group as number | null;
        break;
    }

    const msgBody = {
      headline: data.headline,
      body: data.body,
      status: data.status as StatusTypes,
      msg_type: 2 as 2,
      target_id,
      target_group,
    };

    const request = await addMessage(msgBody);
    if (request.error) {
      setError('root', {
        type: 'manual',
        message: request.error || t('errors.default'),
      });
      return false;
    }
    if (!request.error_code) {
      onClose();
      return true;
    }
    return false;
  };

  const updateMessage = async (data: SchemaType): Promise<boolean> => {
    if (!defaultValues || 'user_needs_to_consent' in defaultValues || !defaultValues?.hash_id) return false;

    let target_id: string | null = null;
    let target_group: number | null = null;

    switch (messageType) {
      case 0:
        target_id = data.target_id as string | null;
        break;
      case 1:
        target_group = data.target_group as number | null;
        break;
    }

    const request = await editMessage({
      message_id: defaultValues.id,
      headline: data.headline,
      body: data.body,
      status: data.status as StatusTypes,
      msg_type: defaultValues.msg_type,
      target_id,
      target_group,
    });
    if (request.error) {
      setError('root', {
        type: 'manual',
        message: request.error || t('errors.default'),
      });
      return false;
    }
    if (!request.error_code) {
      onClose();
      return true;
    }
    return false;
  };

  const changeTarget = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newType = Number(event.target.value) as MessageToType;
    setMessageType(newType);
  };

  // Watch for target_id and target_group to update messageType
  const watchedTargetId = watch('target_id');
  const watchedTargetGroup = watch('target_group');

  useEffect(() => {
    // Set messageType based on which target field has a value
    if (watchedTargetId && !watchedTargetGroup) {
      setMessageType(0); // User target
    } else if (watchedTargetGroup && !watchedTargetId) {
      setMessageType(1); // Group target
    }
  }, [watchedTargetId, watchedTargetGroup]);

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
              {t(`actions.${defaultValues ? 'edit' : 'add'}`, { var: t(`scopes.messages.name`) })}
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
                data-testid="message-type-select"
                slotProps={{
                  select: {
                    MenuProps: {
                      PaperProps: {
                        'data-testid': `message-type-select-list`,
                      } as any,
                    },
                  },
                }}
                sx={{ minWidth: 150 }}
              >
                {toOptions.map((option, index) => (
                  <MenuItem value={index} key={index} data-testid={`select-option-${option.name}`}>
                    {t(option.label)}
                  </MenuItem>
                ))}
              </TextField>
              {(() => {
                switch (messageType) {
                  case 0:
                    return <UserField control={control} />;
                  case 1:
                    return <GroupField control={control} />;
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
              slotProps={{
                htmlInput: { 'data-testid': 'message-headline-input' },
              }}
              {...register('headline')}
            />
            <MarkdownEditor name="body" control={control} required />
          </Stack>
          {errors.root && (
            <Typography color="error" variant="body2">
              {errors.root.message}
            </Typography>
          )}
          <Stack direction="row" justifyContent="end" gap={2}>
            <Button
              onClick={handleCancel}
              color="error"
              aria-label={t('actions.cancel')}
              data-testid="cancel-message-form"
            >
              {t('actions.cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              aria-label={t('actions.confirm')}
              data-testid="submit-message-form"
            >
              {t('actions.confirm')}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
};

export default MessageForms;
