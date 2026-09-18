import { addComment } from '@/services/comments';
import { TEST_IDS } from '@/test-ids';
import { CommentType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import Fab from '@/v2/components/button/Fab/Fab';
import IconButton from '@/v2/components/button/IconButton';
import Comment from '@/v2/components/comment/Comment';
import SelectInput from '@/v2/components/input/SelectInput';
import TextInput from '@/v2/components/input/TextInput';
import FeedbackState from '@/v2/components/ui/FeedbackState';
import Icon from '@/v2/components/ui/Icon/Icon';
import ScopeTitle from '@/v2/components/ui/ScopeTitle';
import ScrollList from '@/v2/components/ui/ScrollList';
import { CommentForm } from '@/v2/forms';
import { ListFilterConfig, useListFilter } from '@/v2/hooks/useListFilter';
import { useModal } from '@/v2/hooks/useModal';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useComments } from './useComments';

const commentsFilterConfig: ListFilterConfig<CommentType> = {
  searchFields: ['content', 'displayname'],
  orderKeys: ['created', 'last_update', 'displayname', 'sum_likes'],
};

interface CommentsProps {
  idea_id: string;
  /** Phase the idea sits in. Commenting closes once approval starts. */
  phase: string;
}

const Comments: React.FC<CommentsProps> = ({ idea_id, phase }) => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const { comments, isLoading, error, refetch } = useComments(idea_id);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    visibleItems: visibleComments,
    searchQuery,
    setSearchQuery,
    orderBy,
    setOrderBy,
    orderOptions,
    reversed,
    setReversed,
  } = useListFilter(comments, commentsFilterConfig, `idea-comments-${idea_id}`);

  const canAddComments = checkPermissions('comments', 'create') && Number(phase) < 20;
  const addCommentLabel = t('v2.ui.actions.add', { var: t('v2.scopes.comments.singular') });

  const handleAddComment = async (data: any): Promise<boolean> => {
    try {
      setFormError(null);
      const response = await addComment({ idea_id, content: data.content });

      if (response.error) {
        setFormError(response.error);
        return false;
      }

      closeModal();
      refetch();
      return true;
    } catch (err) {
      setFormError(err instanceof Error ? err.message : t('errors.default'));
      return false;
    }
  };

  return (
    <section className="flex flex-col h-full min-h-0">
      <ScopeTitle
        as="h2"
        scope="comments"
        count={visibleComments.length}
        total={comments.length}
        defaultOpen={!!searchQuery}
        onToggle={(open) => !open && setSearchQuery('')}
      >
        <TextInput
          dense
          type="search"
          label={t('v2.ui.actions.search')}
          startAdornment={<Icon type="search" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-20"
          data-testid={TEST_IDS.SEARCH_FIELD}
        />
        <SelectInput
          dense
          label={t('v2.ui.sort.label')}
          options={orderOptions}
          value={orderBy}
          onChange={setOrderBy}
          data-testid={TEST_IDS.SORT_SELECT}
        />
        <IconButton
          dense
          hint={t(`v2.ui.sort.${reversed ? 'desc' : 'asc'}`)}
          aria-label={t(`v2.ui.sort.${reversed ? 'desc' : 'asc'}`)}
          aria-pressed={reversed}
          data-testid={TEST_IDS.SORT_DIRECTION_BUTTON}
          onClick={() => setReversed(!reversed)}
          className="min-w-6"
        >
          <Icon type={reversed ? 'sortDesc' : 'sortAsc'} size="1.5em" />
        </IconButton>
      </ScopeTitle>

      {canAddComments && (
        <Fab
          icon={<Icon type="add" />}
          aria-label={addCommentLabel}
          data-testid={TEST_IDS.ADD_COMMENT_BUTTON}
          onClick={() =>
            openModal(
              addCommentLabel,
              <CommentForm
                onSubmit={handleAddComment}
                onCancel={closeModal}
                error={formError}
                onErrorClose={() => setFormError(null)}
              />
            )
          }
          className="fixed bottom-4 self-center z-10"
        />
      )}

      {isLoading && (
        <p role="status" className="p-2">
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
          data-testid="idea-comments-error-state"
        />
      )}

      {!isLoading && !error && comments.length === 0 && (
        <FeedbackState
          image="/img/Paula_schlafend.svg"
          alt={t('v2.alt.sleeping')}
          title={t('v2.ui.error.empty.title')}
          description={t('v2.ui.error.empty.description')}
          data-testid="idea-comments-empty-state"
        />
      )}

      {!isLoading && !error && comments.length > 0 && visibleComments.length === 0 && (
        <FeedbackState
          image="/img/Paula_zwinkernd.svg"
          alt={t('v2.alt.winking')}
          title={t('v2.ui.error.search.title')}
          description={t('v2.ui.error.search.description')}
          data-testid="idea-comments-no-results-state"
        />
      )}

      {!isLoading && !error && visibleComments.length > 0 && (
        <ScrollList storageKey={`idea-comments-${idea_id}`}>
          {visibleComments.map((comment) => (
            <li key={comment.id}>
              <Comment comment={comment} onChanged={refetch} />
            </li>
          ))}
        </ScrollList>
      )}
    </section>
  );
};

export default Comments;
