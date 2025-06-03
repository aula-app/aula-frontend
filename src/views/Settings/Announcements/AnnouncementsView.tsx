import { AnnouncementForms } from '@/components/DataForms';
import DataTable from '@/components/DataTable';
import PaginationBar from '@/components/DataTable/PaginationBar';
import FilterBar from '@/components/FilterBar';
import { deleteAnnouncement, getAnnouncements } from '@/services/announcements';
import { useAppStore } from '@/store/AppStore';
import { StatusTypes } from '@/types/Generics';
import { AnnouncementType } from '@/types/Scopes';
import { getDataLimit } from '@/utils';
import { CONSENT_OPTIONS } from '@/utils/scopes';
import { Drawer, MenuItem, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/** * Renders "Announcements" view
 * url: /settings/announcements
 */

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
  const [appState, dispatch] = useAppStore();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>([]);
  const [totalAnnouncements, setTotalAnnouncements] = useState(0);

  const [status, setStatus] = useState<StatusTypes>(1);
  const [user_needs_to_consent, setConsentType] = useState<StatusTypes>(-1);
  const [search_field, setSearchField] = useState('');
  const [search_text, setSearchText] = useState('');

  const [asc, setAsc] = useState(true);
  const [limit, setLimit] = useState(getDataLimit());
  const [offset, setOffset] = useState(0);
  const [orderby, setOrderby] = useState(COLUMNS[0].orderId);

  const [edit, setEdit] = useState<AnnouncementType | boolean>(false); // false = update dialog closed ;true = new idea; AnnouncementType = item to edit;

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    const response = await getAnnouncements({
      asc: Number(asc) as 0 | 1,
      limit,
      offset,
      orderby,
      search_field,
      search_text,
      status,
      user_needs_to_consent,
    });
    if (response.error) setError(response.error);
    else {
      setAnnouncements(response.data || []);
      setTotalAnnouncements(response.count as number);
    }
    setLoading(false);
  }, [search_field, search_text, status, asc, limit, offset, orderby, user_needs_to_consent]);

  const deleteAnnouncements = (items: Array<string>) =>
    items.map(async (announcement) => {
      const request = await deleteAnnouncement(announcement);
      if (!request.error) onClose();
    });

  const onClose = () => {
    setEdit(false);
    fetchAnnouncements();
  };

  useEffect(() => {
    dispatch({ action: 'SET_BREADCRUMB', breadcrumb: [[t('ui.navigation.announcements'), '']] });
    fetchAnnouncements();
  }, []);

  return (
    <Stack width="100%" height="100%" pt={2}>
      <Stack pl={2}>
        <FilterBar
          fields={FILTER}
          scope="announcements"
          onStatusChange={(newStatus) => setStatus(newStatus)}
          onFilterChange={([field, text]) => {
            setSearchField(field);
            setSearchText(text);
          }}
        >
          <TextField
            label={t(`settings.columns.user_needs_to_consent`)}
            select
            variant="filled"
            size="small"
            onChange={(e) => setConsentType(Number(e.target.value) as StatusTypes)}
            value={user_needs_to_consent}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value={-1}>&nbsp;</MenuItem>
            {CONSENT_OPTIONS.map((option) => (
              <MenuItem value={option.value} key={option.value}>
                {t(option.label)}
              </MenuItem>
            ))}
          </TextField>
        </FilterBar>
      </Stack>
      <Stack flex={1} gap={2} sx={{ overflowY: 'auto' }}>
        <DataTable
          scope="announcements"
          columns={COLUMNS}
          rows={announcements}
          orderAsc={asc}
          orderBy={orderby}
          setAsc={setAsc}
          setLimit={setLimit}
          setOrderby={setOrderby}
          setEdit={(text) => setEdit(text as AnnouncementType)}
          setDelete={deleteAnnouncements}
          isLoading={isLoading}
        />
        {error && <Typography>{t(error)}</Typography>}
        <PaginationBar pages={Math.ceil(totalAnnouncements / limit)} setPage={(page) => setOffset(page * limit)} />
      </Stack>
      <Drawer anchor="bottom" open={!!edit} onClose={onClose} sx={{ overflowY: 'auto' }}>
        <AnnouncementForms onClose={onClose} defaultValues={typeof edit !== 'boolean' ? edit : undefined} />
      </Drawer>
    </Stack>
  );
};

export default AnnouncementsView;
