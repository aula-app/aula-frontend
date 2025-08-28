import { AppIcon, EmptyState, ScopeHeader } from '@/components';
import { IdeaForms } from '@/components/DataForms';
import { IdeaBubble } from '@/components/Idea';
import IdeaBubbleSkeleton from '@/components/Idea/IdeaBubble/IdeaBubbleSkeleton';
import { useSearchAndSort, createTextFilter, useFilter } from '@/hooks';
import { getWildIdeasByUser } from '@/services/dashboard';
import { deleteIdea, getUserIdeasByPhase } from '@/services/ideas';
import { useAppStore } from '@/store/AppStore';
import { IdeaType } from '@/types/Scopes';
import { checkPermissions, phases } from '@/utils';
import { Drawer, Fab, Stack } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import DashBoard from '../Welcome/Dashboard';

// Configuration interfaces
interface PhaseConfig<T> {
  title: string;
  phaseIcon: string;
  fetchData: () => Promise<{ data?: T[] | null; error?: string | null }>;
  searchableFields: string[];
  sortOptions: Array<{ value: string; labelKey: string }>;
  ItemComponent: React.ComponentType<{
    item: T;
    onEdit: () => void;
    onDelete: () => void;
    to?: string;
  }>;
  SkeletonComponent: React.ComponentType;
  FormComponent: React.ComponentType<{
    onClose: () => void;
    defaultValues?: T;
  }>;
  canCreate: boolean;
  createButtonConfig: { icon: string; label: string };
  deleteItem: (id: string) => Promise<{ error?: string | null }>;
  getItemRoute?: (item: T, phase?: string) => string;
  emptyStateConfig: { title: string; description: string };
  scopeKey: string;
}

/**
 * Unified PhaseView component that handles all phase types consistently
 * url: /Phase/:phase
 */
const PhasesView = () => {
  const { t } = useTranslation();
  const { phase } = useParams();
  const [, dispatch] = useAppStore();

  // Generic state management
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<IdeaType[]>([]);
  const [edit, setEdit] = useState<IdeaType | boolean>();

  // Get phase configuration
  const getPhaseConfig = useCallback((): PhaseConfig<IdeaType> => {
    const phaseNum = Number(phase);

    if (phaseNum === 0) {
      // Wild Ideas Phase
      return {
        title: t('phases.wild'),
        phaseIcon: 'wild',
        fetchData: getWildIdeasByUser,
        searchableFields: ['title', 'content', 'displayname'],
        sortOptions: [
          { value: 'created', labelKey: 'settings.columns.created' },
          { value: 'sum_likes', labelKey: 'settings.columns.sum_likes' },
          { value: 'sum_comments', labelKey: 'settings.columns.sum_comments' },
        ],
        ItemComponent: ({ item, onEdit, onDelete, to }) => (
          <IdeaBubble idea={item} to={to} onEdit={onEdit} onDelete={onDelete} />
        ),
        SkeletonComponent: IdeaBubbleSkeleton,
        FormComponent: IdeaForms,
        canCreate: checkPermissions('ideas', 'create'),
        createButtonConfig: { icon: 'idea', label: 'add idea' },
        deleteItem: deleteIdea,
        getItemRoute: (item, phase) => `/room/${item.room_hash_id}/phase/${phase}/idea/${item.hash_id}`,
        emptyStateConfig: { title: t('ui.empty.dashboard.title'), description: t('ui.empty.dashboard.description') },
        scopeKey: 'ideas',
      };
    } else {
      // Box Ideas Phase
      return {
        title: t(`phases.name-${phase}`),
        phaseIcon: (phases[phase as keyof typeof phases] || 'box') as string,
        fetchData: () => getUserIdeasByPhase(phaseNum),
        searchableFields: ['title', 'content', 'displayname'],
        sortOptions: [
          { value: 'created', labelKey: 'settings.columns.created' },
          { value: 'sum_likes', labelKey: 'settings.columns.sum_likes' },
          { value: 'sum_comments', labelKey: 'settings.columns.sum_comments' },
        ],
        ItemComponent: ({ item, onEdit, onDelete, to }) => (
          <IdeaBubble idea={item} to={to} onEdit={onEdit} onDelete={onDelete} />
        ),
        SkeletonComponent: IdeaBubbleSkeleton,
        FormComponent: IdeaForms,
        canCreate: checkPermissions('ideas', 'create'),
        createButtonConfig: { icon: 'idea', label: 'add idea' },
        deleteItem: deleteIdea,
        getItemRoute: (item, phase) => `/room/${item.room_hash_id}/phase/${phase}/idea/${item.hash_id}`,
        emptyStateConfig: { title: t('ui.empty.dashboard.title'), description: t('ui.empty.dashboard.description') },
        scopeKey: 'ideas',
      };
    }
  }, [phase]);

  const config = getPhaseConfig();

  // Search and sort functionality
  const { searchQuery, sortKey, sortDirection, scopeHeaderProps } = useSearchAndSort({
    sortOptions: config.sortOptions.map((opt) => ({
      value: opt.value as string,
      labelKey: opt.labelKey,
    })),
  });

  // Create filter function
  const filterFunction = useMemo(
    () => createTextFilter<IdeaType>(config.searchableFields as (keyof IdeaType)[]),
    [config.searchableFields]
  );

  // Apply filtering
  const filteredData = useFilter({
    data,
    filterValue: searchQuery,
    filterFunction,
  });

  // Sort the filtered data
  const sortedData = useMemo(() => {
    return filteredData.slice().sort((a, b) => {
      const valueA = a[sortKey as keyof IdeaType];
      const valueB = b[sortKey as keyof IdeaType];

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }

      const comparison = String(valueA).localeCompare(String(valueB));
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortKey, sortDirection]);

  // Data fetching
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await config.fetchData();
      if (response.error) {
        setError(response.error);
      } else {
        setData(response.data || []);
      }
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [config.fetchData]);

  // Effect to fetch data and set breadcrumb
  useEffect(() => {
    dispatch({
      action: 'SET_BREADCRUMB',
      breadcrumb: [[t('ui.navigation.dashboard')]],
    });
    fetchData();
  }, [phase, dispatch, fetchData, t]);

  // Event handlers
  const onEdit = (item: IdeaType) => {
    setEdit(item);
  };

  const onDelete = async (id: string) => {
    const request = await config.deleteItem(id);
    if (!request.error) onClose();
  };

  const onClose = () => {
    setEdit(undefined);
    fetchData();
  };

  const ItemComponent = config.ItemComponent;
  const SkeletonComponent = config.SkeletonComponent;
  const FormComponent = config.FormComponent;

  return (
    <Stack overflow="hidden" flex={1}>
      <DashBoard show={true} />
      <Stack flex={1} p={2} sx={{ overflowY: 'auto' }}>
        {/* Header with search and sort */}
        <ScopeHeader
          title={t('scopes.ideas.inPhase', {
            var: data.length === 1 ? t('scopes.ideas.name') : t('scopes.ideas.plural'),
            phase: config.title,
          })}
          scopeKey={config.scopeKey}
          totalCount={data.length}
          {...scopeHeaderProps}
        />

        {/* Error state */}
        {error && <EmptyState title="Error" description={error} />}

        {/* Empty state */}
        {!isLoading && !error && sortedData.length === 0 && (
          <EmptyState title={config.emptyStateConfig.title} description={config.emptyStateConfig.description} />
        )}

        {/* Grid content */}
        <Grid container spacing={2} p={1}>
          {/* Loading skeleton */}
          {isLoading && (
            <Grid size={{ xs: 12, sm: 6, lg: 4, xl: 3 }} sx={{ scrollSnapAlign: 'center' }}>
              <SkeletonComponent />
            </Grid>
          )}

          {/* Data items */}
          {!isLoading &&
            sortedData.map((item) => (
              <Grid key={item.hash_id} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }} sx={{ scrollSnapAlign: 'center' }}>
                <ItemComponent
                  item={item}
                  onEdit={() => onEdit(item)}
                  onDelete={() => onDelete(item.hash_id)}
                  to={config.getItemRoute ? config.getItemRoute(item, phase) : undefined}
                />
              </Grid>
            ))}
        </Grid>

        {/* Create button */}
        {config.canCreate && (
          <Fab
            aria-label={config.createButtonConfig.label}
            color="primary"
            sx={{
              position: 'fixed',
              bottom: 40,
              right: 40,
              zIndex: 1000,
            }}
            onClick={() => setEdit(true)}
          >
            <AppIcon icon={config.createButtonConfig.icon as any} />
          </Fab>
        )}

        {/* Edit/Create drawer */}
        <Drawer anchor="bottom" open={!!edit} onClose={onClose} sx={{ overflowY: 'auto' }}>
          <FormComponent onClose={onClose} defaultValues={typeof edit === 'object' ? edit : undefined} />
        </Drawer>
      </Stack>
    </Stack>
  );
};

export default PhasesView;
