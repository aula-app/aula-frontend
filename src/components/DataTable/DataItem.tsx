import { AppIcon, AppIconButton } from '@/components';
import { getGroup } from '@/services/groups';
import { getRoom } from '@/services/rooms';
import { getUser } from '@/services/users';
import { useAppStore } from '@/store';
import { PossibleFields, SettingType } from '@/types/Scopes';
import { FORMAT_DATE_TIME, phases, STATUS } from '@/utils';
import { Chip, Stack } from '@mui/material';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Props for the DataItem component
 */
type Props = {
  row: SettingType;
  column: keyof PossibleFields;
};

/**
 * Valid message consent types
 */
type MessageConsentValues = 'message' | 'announcement' | 'alert';
const messageConsentValues = ['message', 'announcement', 'alert'] as MessageConsentValues[];

/**
 * Component that renders a table cell's content with specialized formatting based on the column type.
 */
const DataItem: React.FC<Props> = ({ row, column }) => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  const [responseName, setName] = useState<string>('');
  const [hidden, setHidden] = useState(true);

  const value = row[column as keyof SettingType];

  const getUserName = (id: string) => {
    getUser(id).then((response) => {
      if (response.error || !response.data) return;
      setName(response.data.displayname);
    });
  };

  const getRoomName = (id: string) => {
    getRoom(id).then((response) => {
      if (response.error || !response.data) return;
      setName(response.data.room_name);
    });
  };

  const getGroupName = (id: string) => {
    getGroup(id).then((response) => {
      if (response.error || !response.data) return;
      setName(response.data.group_name);
    });
  };

  useEffect(() => {
    switch (column) {
      case 'creator_id':
      case 'user_id':
      case 'user_hash_id':
        getUserName(value as string);
        break;
      case 'room_hash_id':
        getRoomName(value as string);
        break;
      case 'target_group':
        getGroupName(value as string);
        break;
      default:
        break;
    }
  }, [value]);

  /**
   * Copies the cell's text content to clipboard and shows a success message
   */
  const copyText = (e: SyntheticEvent) => {
    e.stopPropagation();
    navigator.clipboard
      .writeText(String(value))
      .then(() => dispatch({ type: 'ADD_POPUP', message: { message: t('auth.password.copied'), type: 'success' } }));
  };

  // Main switch statement organized by data type
  switch (column) {
    // Boolean fields
    case 'approved':
      return <>{t(Boolean(value) ? 'ui.common.yes' : 'ui.common.no')}</>;

    // IDs that require name lookup
    case 'creator_id':
    case 'user_hash_id':
    case 'user_id':
    case 'room_hash_id':
    case 'target_group':
      return <>{responseName}</>;

    // Date fields that need to be converted to local timezone
    case 'created':
    case 'last_update':
    case 'last_login':
      return <>{dayjs.utc(value).tz(dayjs.tz.guess()).format(FORMAT_DATE_TIME)}</>;

    // Enum/Status fields
    case 'phase_id':
      return <>{phases[Number()] ? t(`phases.${phases[Number(value)]}`) : ''}</>;
    case 'status':
      return <>{t(STATUS[Number(value)].label)}</>;
    case 'userlevel':
      return <>{t(`roles.${value}` || '')}</>;
    case 'user_needs_to_consent':
      return <>{t(`consent.${messageConsentValues[Number(value)]}` || '')}</>;

    // Special fields
    case 'temp_pw':
      return !!value ? (
        <Stack direction="row" alignItems="center">
          <Chip
            className="noPrint"
            sx={{ width: '100%', justifyContent: 'space-between', px: 1 }}
            label={hidden ? '*********' : value}
            onClick={copyText}
            icon={<AppIcon icon="copy" size="small" />}
          />
          <AppIconButton
            className="noPrint"
            size="small"
            icon={hidden ? 'visibilityOn' : 'visibilityOff'}
            onClick={(e) => {
              e.stopPropagation();
              setHidden(!hidden);
            }}
          />
          <Stack className="printOnly">{value}</Stack>
        </Stack>
      ) : (
        <Stack className="printOnly">{t('auth.messages.email')}</Stack>
      );

    // Default case for all other fields
    default:
      return <>{value}</>;
  }
};

export default DataItem;
