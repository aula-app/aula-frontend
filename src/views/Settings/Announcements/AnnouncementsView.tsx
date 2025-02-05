import { AnnouncementForms } from '@/components/DataForms';
import DataTable from '@/components/DataTable';
import DataTableSkeleton from '@/components/DataTable/DataTableSkeleton';
import PaginationBar from '@/components/DataTable/PaginationBar';
import FilterBar from '@/components/FilterBar';
import {
  addAnnouncement,
  AnnouncementArguments,
  deleteAnnouncement,
  editAnnouncement,
  EditAnnouncementArguments,
  getAnnouncements,
} from '@/services/announcements';
import { StatusTypes } from '@/types/Generics';
import { AnnouncementType } from '@/types/Scopes';
import { getDataLimit } from '@/utils';
import { Drawer, Typography } from '@mui/material';
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
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>([]);
  const [totalAnnouncements, setTotalAnnouncements] = useState(0);

  const [status, setStatus] = useState<StatusTypes>(1);
  const [search_field, setSearchField] = useState('');
  const [search_text, setSearchText] = useState('');

  const [asc, setAsc] = useState(true);
  const [limit, setLimit] = useState(getDataLimit());
  const [offset, setOffset] = useState(0);
  const [orderby, setOrderby] = useState(COLUMNS[0].orderId);

  const [edit, setEdit] = useState<string | boolean>(false); // false = update dialog closed ;true = new idea; string = item hash_id;

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
    });
    if (response.error) setError(response.error);
    else {
      setAnnouncements(response.data || []);
      setTotalAnnouncements(response.count as number);
    }
    setLoading(false);
  }, [search_field, search_text, status, asc, limit, offset, orderby]);

  const onSubmit = (data: AnnouncementArguments) => {
    if (!edit) return;
    typeof edit === 'boolean' ? newAnnouncement(data) : updateAnnouncement(data as EditAnnouncementArguments);
  };

  const newAnnouncement = async (data: AnnouncementArguments) => {
    const request = await addAnnouncement({
      headline: data.headline,
      body: data.body,
      user_needs_to_consent: data.user_needs_to_consent,
      consent_text: data.consent_text,
      status: data.status,
    });
    if (!request.error) onClose();
  };

  const updateAnnouncement = async (data: EditAnnouncementArguments) => {
    const announcement = announcements.find((announcement) => announcement.hash_id === edit);
    if (!announcement || !announcement.hash_id) return;
    const request = await editAnnouncement({
      text_id: announcement.hash_id,
      headline: data.headline,
      body: data.body,
      user_needs_to_consent: data.user_needs_to_consent,
      consent_text: data.consent_text,
      status: data.status,
    });
    if (!request.error) onClose();
  };

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
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  return (
    <Stack width="100%" height="100%" py={2}>
      <Stack pl={2}>
        <FilterBar
          fields={FILTER}
          scope="announcements"
          onStatusChange={(newStatus) => setStatus(newStatus)}
          onFilterChange={([field, text]) => {
            setSearchField(field);
            setSearchText(text);
          }}
        />
      </Stack>
      <Stack flex={1} gap={2} sx={{ overflowY: 'auto' }}>
        {isLoading && <DataTableSkeleton />}
        {error && <Typography>{t(error)}</Typography>}
        {!isLoading && announcements.length > 0 && (
          <DataTable
            scope="announcements"
            columns={COLUMNS}
            rows={announcements}
            orderAsc={asc}
            orderBy={orderby}
            setAsc={setAsc}
            setLimit={setLimit}
            setOrderby={setOrderby}
            setEdit={setEdit}
            setDelete={deleteAnnouncements}
          />
        )}
        <PaginationBar pages={Math.ceil(totalAnnouncements / limit)} setPage={(page) => setOffset(page * limit)} />
      </Stack>
      <Drawer anchor="bottom" open={!!edit} onClose={onClose} sx={{ overflowY: 'auto' }}>
        <AnnouncementForms
          onClose={onClose}
          onSubmit={onSubmit}
          defaultValues={
            typeof edit !== 'boolean'
              ? (announcements.find((announcement) => announcement.hash_id === edit) as AnnouncementArguments)
              : undefined
          }
        />
      </Drawer>
    </Stack>
  );
};

export default AnnouncementsView;
