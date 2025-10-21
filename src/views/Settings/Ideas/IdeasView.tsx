import { IdeaForms } from '@/components/DataForms';
import SettingsView from '@/components/SettingsView';
import { useDataTableState } from '@/hooks';
import { deleteIdea, getIdeas } from '@/services/ideas';
import { useAppStore } from '@/store/AppStore';
import { IdeaType } from '@/types/Scopes';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const FILTER = ['title', 'content', 'displayname'] as Array<keyof IdeaType>;

const COLUMNS = [
  { name: 'title', orderId: 5 },
  { name: 'content', orderId: 6 },
  { name: 'user_id', orderId: 8 },
  { name: 'room_hash_id', orderId: 7 },
  { name: 'approved', orderId: 13 },
  { name: 'approval_comment', orderId: 14 },
  { name: 'status', orderId: 2 },
  { name: 'created', orderId: 4 },
  { name: 'last_update', orderId: 0 },
] as Array<{ name: keyof IdeaType; orderId: number }>;

const IdeasView: React.FC = () => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();

  const fetchFn = useCallback(async (params: Record<string, unknown>) => {
    const { search_field, ...otherParams } = params;
    return await getIdeas({
      ...otherParams,
      search_field: search_field === 'displayname' ? 'au_users_basedata.displayname' : (search_field as string),
    });
  }, []);

  const dataTableState = useDataTableState<IdeaType>({
    initialOrderBy: COLUMNS[0].orderId,
    fetchFn,
    deleteFn: deleteIdea,
  });

  useEffect(() => {
    dispatch({ action: 'SET_BREADCRUMB', breadcrumb: [[t('ui.navigation.ideas'), '/']] });
  }, [dispatch, t]);

  return (
    <SettingsView
      scope="ideas"
      columns={COLUMNS}
      filterFields={FILTER}
      dataTableState={dataTableState}
      FormComponent={IdeaForms as React.ComponentType<{ onClose: () => void; defaultValues?: unknown }>}
    />
  );
};

export default IdeasView;
