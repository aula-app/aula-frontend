import { usePageTitle } from '@/hooks/usePageTitle';
import { useAppStore } from '@/store/AppStore';
import { TEST_IDS } from '@/test-ids';
import ComboBox from '@/v2/components/input/ComboBox';
import TextInput from '@/v2/components/input/TextInput';
import ListPageLayout from '@/v2/components/layout/ListPageLayout';
import FeedbackState from '@/v2/components/ui/FeedbackState';
import Icon from '@/v2/components/ui/Icon/Icon';
import ScopeTitle from '@/v2/components/ui/ScopeTitle';
import ScrollList from '@/v2/components/ui/ScrollList';
import UpdateCard from '@/v2/components/update/UpdateCard';
import { countEvents, groupUpdates, IdeaUpdate } from '@/v2/components/update/groupUpdates';
import { UPDATE_VARIANTS } from '@/v2/components/update/UpdateCard/updateVariant';
import { ListFilterConfig, useListFilter } from '@/v2/hooks/useListFilter';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUpdates } from './useUpdates';

const updatesFilterConfig: ListFilterConfig<IdeaUpdate> = { searchFields: ['title'] };

/** url: /updates */
const Updates = () => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  const { events, isLoading, error } = useUpdates();
  const [types, setTypes] = useState<string[]>(UPDATE_VARIANTS);
  const ideas = useMemo(() => groupUpdates(events.filter((event) => types.includes(event.variant))), [events, types]);
  const typeOptions = UPDATE_VARIANTS.map((variant) => ({
    value: variant,
    label: t(`v2.scopes.updates.types.${variant}`),
  }));
  const {
    visibleItems: visibleIdeas,
    searchQuery,
    setSearchQuery,
  } = useListFilter(ideas, updatesFilterConfig, 'updates');
  const visibleCount = visibleIdeas.reduce((sum, idea) => sum + countEvents(idea), 0);
  usePageTitle('pageTitles.updates');

  useEffect(() => {
    dispatch({ type: 'SET_BREADCRUMB', breadcrumb: [[t('ui.navigation.updates'), '/updates']] });
  }, [dispatch, t]);

  return (
    <ListPageLayout
      header={
        <>
          <ScopeTitle
            scope="updates"
            count={visibleCount}
            total={events.length}
            suffix={
              visibleIdeas.length > 0 ? t('v2.scopes.updates.onIdeas', { count: visibleIdeas.length }) : undefined
            }
            defaultOpen={!!searchQuery}
            onToggle={(open) => {
              if (open) return;
              setSearchQuery('');
              setTypes(UPDATE_VARIANTS);
            }}
          >
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <TextInput
                dense
                type="search"
                label={t('v2.ui.actions.search')}
                startAdornment={<Icon type="search" />}
                value={searchQuery}
                onChange={setSearchQuery}
                className="w-full"
                data-testid={TEST_IDS.SEARCH_FIELD}
              />
              <ComboBox
                dense
                label={t('v2.scopes.updates.types.label')}
                tagsLabel={t('v2.scopes.updates.types.selected')}
                options={typeOptions}
                value={types}
                onChange={setTypes}
                className="w-full"
                data-testid={TEST_IDS.UPDATE_TYPE_FILTER}
              />
            </div>
          </ScopeTitle>
          <p className="px-2 pb-2 text-sm text-muted sm:px-4">{t('v2.scopes.updates.subtitle')}</p>
        </>
      }
    >
      {isLoading && (
        <p role="status">
          <span aria-hidden="true">...</span>
          <span className="sr-only">{t('status.loading')}</span>
        </p>
      )}

      {error && (
        <FeedbackState
          image="/img/Paula_unzufrieden.svg"
          alt={t('v2.alt.sad')}
          title={t(`v2.ui.error.${error}.title`)}
          description={t(`v2.ui.error.${error}.description`)}
          data-testid="updates-error-state"
        />
      )}

      {!isLoading && !error && events.length === 0 && (
        <FeedbackState
          image="/img/Paula_schlafend.svg"
          alt={t('v2.alt.sleeping')}
          title={t('v2.scopes.updates.empty.title')}
          description={t('v2.scopes.updates.empty.description')}
          data-testid="updates-empty-state"
        />
      )}

      {!isLoading && !error && events.length > 0 && visibleIdeas.length === 0 && (
        <FeedbackState
          image="/img/Paula_zwinkernd.svg"
          alt={t('v2.alt.winking')}
          title={t('v2.ui.error.search.title')}
          description={t('v2.ui.error.search.description')}
          data-testid="updates-no-results-state"
        />
      )}

      {!isLoading && visibleIdeas.length > 0 && (
        <ScrollList storageKey="updates" className="gap-1">
          {visibleIdeas.map((idea) => (
            <li key={idea.idea_id} data-testid="update-item">
              <UpdateCard update={idea} />
            </li>
          ))}
        </ScrollList>
      )}
    </ListPageLayout>
  );
};

export default Updates;
