import { AnnouncementForms } from '@/components/DataForms';
import SettingsView from '@/components/SettingsView';
import { useDataTableState } from '@/hooks';
import { deleteAnnouncement, getAnnouncements } from '@/services/announcements';
import { useAppStore } from '@/store/AppStore';
import { StatusTypes } from '@/types/Generics';
import { AnnouncementType } from '@/types/Scopes';
import { CONSENT_OPTIONS } from '@/utils/scopes';
import { MenuItem, TextField } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const FILTER = ['headline', 'body', 'creator_id'] as Array<keyof AnnouncementType>;

const COLUMNS = [
  { name: 'headline', orderId: 5 },
  { name: 'body', orderId: 6 },
  { name: 'user_needs_to_consent', orderId: 8 },
  { name: 'creator_id', orderId: 3 },
  { name: 'created', orderId: 4 },
  { name: 'last_update', orderId: 0 },
] as Array<{ name: keyof AnnouncementType; orderId: number }>;

const AnnouncementsView: React.FC = () => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  const [userNeedsToConsent, setConsentType] = useState<StatusTypes>(-1);

  const fetchFn = useCallback(
    async (params: Record<string, unknown>) => {
      return await getAnnouncements({
        ...params,
        user_needs_to_consent: userNeedsToConsent,
      });
    },
    [userNeedsToConsent]
  );

  const dataTableState = useDataTableState<AnnouncementType>({
    initialOrderBy: COLUMNS[0].orderId,
    fetchFn,
    deleteFn: deleteAnnouncement,
  });

  useEffect(() => {
    dispatch({ action: 'SET_BREADCRUMB', breadcrumb: [[t('ui.navigation.announcements'), '']] });
  }, [dispatch, t]);

  const extraFilters = (
    <TextField
      label={t(`settings.columns.user_needs_to_consent`)}
      select
      variant="filled"
      size="small"
      onChange={(e) => setConsentType(Number(e.target.value) as StatusTypes)}
      value={userNeedsToConsent}
      sx={{ minWidth: 200 }}
    >
      <MenuItem value={-1}>&nbsp;</MenuItem>
      {CONSENT_OPTIONS.map((option) => (
        <MenuItem value={option.value} key={option.value}>
          {t(option.label)}
        </MenuItem>
      ))}
    </TextField>
  );

  return (
    <SettingsView
      scope="announcements"
      columns={COLUMNS}
      filterFields={FILTER}
      dataTableState={dataTableState}
      FormComponent={AnnouncementForms as React.ComponentType<{ onClose: () => void; defaultValues?: unknown }>}
      extraFilters={extraFilters}
    />
  );
};

export default AnnouncementsView;
