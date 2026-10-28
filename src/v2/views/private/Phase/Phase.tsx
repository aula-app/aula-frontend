import { usePageTitle } from '@/hooks/usePageTitle';
import { useAppStore } from '@/store/AppStore';
import { TEST_IDS } from '@/test-ids';
import { IdeaType } from '@/types/Scopes';
import { RoomPhases } from '@/types/SettingsTypes';
import { phases } from '@/utils';
import Dashboard from '@/v2/components/dashboard/Dashboard';
import Idea from '@/v2/components/idea/Idea';
import SortSelect from '@/v2/components/input/SortSelect';
import TextInput from '@/v2/components/input/TextInput';
import ListPageLayout from '@/v2/components/layout/ListPageLayout';
import FeedbackState from '@/v2/components/ui/FeedbackState';
import Icon from '@/v2/components/ui/Icon/Icon';
import ScopeTitle from '@/v2/components/ui/ScopeTitle';
import ScrollList from '@/v2/components/ui/ScrollList';
import { useCollapseOnScroll } from '@/v2/hooks/useCollapseOnScroll';
import { useIdeaVotes } from '@/v2/hooks/useIdeaVotes';
import { ListFilterConfig, useListFilter } from '@/v2/hooks/useListFilter';
import { useQuorum } from '@/v2/hooks/useQuorum';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router-dom';
import { usePhaseIdeas } from './usePhaseIdeas';

const phaseIdeasFilterConfig: ListFilterConfig<IdeaType> = {
  searchFields: ['title', 'content', 'displayname'],
  orderKeys: ['created', 'last_updated', 'displayname', 'title'],
};

const isValidPhase = (phase: string): phase is `${RoomPhases}` => Object.keys(phases).includes(phase);

const PhaseIdeas = ({ phase }: { phase: `${RoomPhases}` }) => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  const dashboard = useCollapseOnScroll();
  const quorum = useQuorum(phase);
  const { ideas, isLoading, error, refetch } = usePhaseIdeas(phase);
  const votes = useIdeaVotes(ideas, phase === '30');
  const storageKey = `phase-ideas-${phase}`;
  const {
    visibleItems: visibleIdeas,
    searchQuery,
    setSearchQuery,
    orderBy,
    setOrderBy,
    orderOptions,
    reversed,
    setReversed,
  } = useListFilter(ideas, phaseIdeasFilterConfig, storageKey);
  usePageTitle(`phases.name-${phase}`);

  useEffect(() => {
    dispatch({ type: 'SET_BREADCRUMB', breadcrumb: [[t(`phases.name-${phase}`), `/phase/${phase}`]] });
  }, [phase, dispatch, t]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Dashboard open={dashboard.open} onOpenChange={dashboard.setOpen} />
      <ListPageLayout
        header={
          <ScopeTitle
            scope="ideas"
            phase={phase}
            count={visibleIdeas.length}
            total={ideas.length}
            defaultOpen={!!searchQuery}
            onToggle={(open) => !open && setSearchQuery('')}
          >
            <TextInput
              dense
              type="search"
              label={t('v2.ui.actions.search')}
              startAdornment={<Icon type="search" />}
              value={searchQuery}
              onChange={setSearchQuery}
              className="flex-1 min-w-20"
              data-testid={TEST_IDS.SEARCH_FIELD}
            />
            <SortSelect
              options={orderOptions}
              value={orderBy}
              onChange={setOrderBy}
              reversed={reversed}
              onReversedChange={setReversed}
              data-testid={TEST_IDS.SORT_SELECT}
            />
          </ScopeTitle>
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
            data-testid="phase-ideas-error-state"
          />
        )}

        {!isLoading && !error && ideas.length === 0 && (
          <FeedbackState
            image="/img/Paula_schlafend.svg"
            alt={t('v2.alt.sleeping')}
            title={t('v2.ui.error.empty.title')}
            description={t('v2.ui.error.empty.description')}
            data-testid="phase-ideas-empty-state"
          />
        )}

        {!isLoading && !error && ideas.length > 0 && visibleIdeas.length === 0 && (
          <FeedbackState
            image="/img/Paula_zwinkernd.svg"
            alt={t('v2.alt.winking')}
            title={t('v2.ui.error.search.title')}
            description={t('v2.ui.error.search.description')}
            data-testid="phase-ideas-no-results-state"
          />
        )}

        {!isLoading && visibleIdeas.length > 0 && (
          <ScrollList storageKey={storageKey} onScroll={dashboard.onScroll}>
            {visibleIdeas.map((idea) => (
              <li key={idea.hash_id} data-testid="phase-idea-item">
                <Idea idea={idea} vote={votes[idea.hash_id]} quorum={quorum} onChanged={refetch} />
              </li>
            ))}
          </ScrollList>
        )}
      </ListPageLayout>
    </div>
  );
};

/** The current user's ideas in one phase, across rooms. url: /phase/:phase */
const Phase = () => {
  const { phase } = useParams<{ phase: string }>();

  if (!phase || !isValidPhase(phase)) return <Navigate to="/404" replace />;

  return <PhaseIdeas key={phase} phase={phase} />;
};

export default Phase;
