import { AppIcon, AppIconButton } from '@/components';
import { useAppStore } from '@/store';
import { PossibleFields } from '@/types/Scopes';
import { SettingNamesType } from '@/types/SettingsTypes';
import { databaseRequest, phases } from '@/utils';
import { statusOptions } from '@/utils/commands';
import DataConfig from '@/utils/Data';
import { Chip, Stack } from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Props for the DataItem component
 * @typedef {Object} Params
 * @property {Record<keyof PossibleFields, string>} row - The data row containing all field values
 * @property {keyof PossibleFields} column - The specific column to render from the row
 */
type Params = {
  row: Record<keyof PossibleFields, string>;
  column: keyof PossibleFields;
};

/**
 * Valid message consent types
 * @type {('message' | 'announcement' | 'alert')[]}
 */
type MessageConsentValues = 'message' | 'announcement' | 'alert';
const messageConsentValues = ['message', 'announcement', 'alert'] as MessageConsentValues[];

/**
 * Component that renders a table cell's content with specialized formatting based on the column type.
 * Handles various data types including:
 * - Boolean values (approved)
 * - User IDs (creator_id, target_id, user_id)
 * - Phase IDs with translation
 * - Room IDs
 * - Status values with translation
 * - Group targets
 * - Temporary passwords (with show/hide functionality)
 * - User levels with translation
 * - Message consent values
 *
 * @param {Params} props - Component props
 * @param {Record<keyof PossibleFields, string>} props.row - The data row containing all field values
 * @param {keyof PossibleFields} props.column - The specific column to render from the row
 * @returns {JSX.Element} Rendered cell content with appropriate formatting
 */
const DataItem = ({ row, column }: Params) => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  const [name, setName] = useState('');
  const [hidden, setHidden] = useState(true);

  /**
   * Fetches and sets the display name for user, room, or group IDs
   * @param {SettingNamesType} scope - The type of entity to fetch ('users', 'rooms', or 'groups')
   * @param {number} id - The ID of the entity to fetch
   */
  async function getNames(scope: SettingNamesType, id: number) {
    await databaseRequest({
      model: DataConfig[scope].requests.model,
      method: DataConfig[scope].requests.get,
      arguments: {
        [DataConfig[scope].requests.id]: id,
      },
    }).then((response) => {
      if (!response.success) return;
      setName(
        scope === 'users'
          ? response.data.realname
          : scope === 'rooms'
            ? response.data.room_name
            : response.data.group_name
      );
    });
  }

  /**
   * Copies the cell's text content to clipboard and shows a success message
   * @param {SyntheticEvent} e - The click event
   */
  const copyText = (e: SyntheticEvent) => {
    e.stopPropagation();
    navigator.clipboard
      .writeText(String(row[column]))
      .then(() => dispatch({ type: 'ADD_POPUP', message: { message: t('texts.passCopy'), type: 'success' } }));
  };

  switch (column) {
    case 'approved':
      return <>{t(`generics.${Boolean(row[column]) ? 'yes' : 'no'}`)}</>;
    case 'creator_id':
      getNames('users', Number(row[column]));
      return <>{name}</>;
    case 'phase_id':
      return <>{phases[row[column]] ? t(`phases.${phases[row[column]]}`) : ''}</>;
    case 'room_id':
      getNames('rooms', Number(row[column]));
      return <>{name}</>;
    case 'status':
      return <>{t(statusOptions.find((status) => String(status.value) === row[column])?.label || '')}</>;
    case 'target_group':
      getNames('groups', Number(row[column]));
      return <>{name}</>;
    case 'target_id':
      getNames('users', Number(row[column]));
      return <>{name}</>;
    case 'temp_pw':
      return row[column] ? (
        <Stack direction="row" alignItems="center">
          <Chip
            sx={{ width: '100%', justifyContent: 'space-between', px: 1 }}
            label={hidden ? '*********' : row[column]}
            onClick={copyText}
            icon={<AppIcon icon="copy" size="small" />}
          />
          <AppIconButton
            size="small"
            icon={hidden ? 'visibilityOn' : 'visibilityOff'}
            onClick={(e) => {
              e.stopPropagation();
              setHidden(!hidden);
            }}
          />
        </Stack>
      ) : (
        <></>
      );
    case 'user_id':
      getNames('users', Number(row[column]));
      return <>{name}</>;
    case 'userlevel':
      return <>{t(`roles.${row[column]}` || '')}</>;
    case 'user_needs_to_consent':
      return <>{t(`consent.${messageConsentValues[Number(row[column])]}` || '')}</>;
    default:
      return <>{row[column]}</>;
  }
};

export default DataItem;
