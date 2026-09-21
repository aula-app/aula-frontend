import { deleteIdea, editIdea } from '@/services/ideas';
import { IdeaType } from '@/types/Scopes';
import { RoomPhases } from '@/types/SettingsTypes';
import { checkPermissions, Vote } from '@/utils';
import DeleteButton from '@/v2/components/button/DeleteButton';
import EditButton from '@/v2/components/button/EditButton';
import ReportButton from '@/v2/components/button/ReportButton';
import ShareButton from '@/v2/components/button/ShareButton';
import ApprovalBar, { useIdeaApproval } from '@/v2/components/idea/ApprovalBar';
import ApprovalNote from '@/v2/components/idea/ApprovalNote';
import PhaseStatus, { getPhaseColor, getPhaseColors, getPhaseStatus } from '@/v2/components/idea/PhaseStatus';
import QuorumBar from '@/v2/components/idea/QuorumBar';
import CategoryList, { Category } from '@/v2/components/idea/CategoryList';
import LikeStat from '@/v2/components/idea/LikeStat';
import { useIdeaLike } from '@/v2/components/idea/LikeStat/useIdeaLike';
import { IdeaForm } from '@/v2/forms';
import Stat from '@/v2/components/idea/Stat';
import VoteBar, { useIdeaVote } from '@/v2/components/idea/VoteBar';
import VoteResults, { useVoteResults } from '@/v2/components/idea/VoteResults';
import WinnerBar, { useIdeaWinner } from '@/v2/components/idea/WinnerBar';
import UserBar from '@/v2/components/idea/UserBar';
import Markdown from '@/v2/components/ui/Markdown';
import MoreOptions from '@/v2/components/ui/MoreOptions';
import { TEST_IDS } from '@/test-ids';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import Link from '../../navigation/Link';

interface IdeaProps {
  idea: IdeaType;
  categories?: Category[];
  vote?: Vote | null;
  quorum?: number;
  users?: number;
  /** Renders the idea as its own page: full content, and no links back to the page we are already on. */
  detail?: boolean;
  className?: string;
  onChanged?: () => void;
}

const Idea = ({ idea, categories = [], vote, quorum = 0, users, detail = false, className, onChanged }: IdeaProps) => {
  const { t } = useTranslation();
  const { phase } = useParams<{ phase: `${RoomPhases}` }>();

  const titleId = useId();
  const phase_id = phase || '0';
  const ideaPath = `/room/${idea.room_hash_id}/phase/${phase_id}/idea/${idea.hash_id}`;

  const like = useIdeaLike(idea);
  const voting = useIdeaVote(idea.hash_id, vote);
  const winner = useIdeaWinner(idea.hash_id, idea.is_winner);
  const approval = useIdeaApproval(idea.hash_id, idea.approved, idea.approval_comment);

  const phaseNumber = Number(phase_id);
  const isVoting = phaseNumber >= 30;
  const canLike = phaseNumber < 20;
  const approved = approval.approved ?? 0;
  const isArchived = isVoting && approved === -1;
  const isJudged = phaseNumber >= 20 && !!approved;
  const participants = Number(users) || Number(idea.number_of_users) || 0;

  const hasApprovalBar = detail && phase_id === '20' && checkPermissions('ideas', 'approve');
  const hasVoteBar = detail && phase_id === '30' && !isArchived;
  const hasVoteResults = detail && phase_id === '40' && !isArchived;
  const hasWinnerBar = hasVoteResults && checkPermissions('ideas', 'setWinner');
  // Must agree with what QuorumBar will actually draw: the bubble squares its bottom corner to
  // seat the bar, so promising one that never arrives leaves a cut corner over nothing.
  const hasQuorumBar = participants > 0 && !isArchived && !hasVoteResults && (isVoting || (quorum > 0 && !isJudged));

  const results = useVoteResults(idea.hash_id, hasVoteResults);
  const status = getPhaseStatus({
    idea: { ...idea, approved, is_winner: winner.winner ?? 0 },
    phase: phase_id,
    vote: voting.vote,
  });
  const bubbleColor = status?.colors ?? getPhaseColors(phase_id);
  const hasTopTab = !!status || categories.length > 0;
  const rejectionNote = detail && approved === -1 ? approval.comment : null;

  const Title = detail ? 'h1' : 'h2';

  const body = (
    <>
      <Title id={titleId} className="font-semibold text-inherit">
        {idea.title}
      </Title>
      {idea.content && (
        <Markdown className={twMerge('prose text-inherit', !detail && 'line-clamp-3')}>{idea.content}</Markdown>
      )}
    </>
  );

  return (
    <article
      aria-labelledby={titleId}
      data-testid={`idea-${idea.title}`}
      className={twMerge('flex flex-col gap-1', className)}
    >
      <div className="relative flex flex-col gap-1 flex-1">
        {hasTopTab && (
          <div className="flex flex-wrap items-center justify-end gap-1">
            {status && <PhaseStatus status={status} className={twMerge(categories.length > 0 && 'rounded-tl-none')} />}
            <CategoryList categories={categories} />
          </div>
        )}
        {rejectionNote && <ApprovalNote comment={rejectionNote} colors={bubbleColor} />}
        <div
          className={twMerge(
            'relative flex flex-col-reverse ml-4 gap-1 py-2 px-4 rounded-2xl rounded-bl-none',
            bubbleColor,
            hasQuorumBar || hasVoteResults || hasApprovalBar ? 'rounded-br-none' : '',
            rejectionNote ? 'rounded-t-none' : hasTopTab ? 'rounded-tr-none' : ''
          )}
        >
          {detail ? <div>{body}</div> : <Link to={ideaPath}>{body}</Link>}
          <MoreOptions
            className="absolute top-1 right-1 z-10"
            panelClassName="ml-auto mr-1"
            menuTestId={TEST_IDS.IDEA_MORE_MENU}
            panelTestId={TEST_IDS.IDEA_MORE_OPTIONS_PANEL}
          >
            {(close) => (
              <>
                <EditButton
                  scopeLabel={t('scopes.ideas.name')}
                  subject={idea.title}
                  hidden={!checkPermissions('ideas', 'edit', idea.user_hash_id)}
                  onSave={(data) =>
                    editIdea({
                      idea_id: idea.hash_id,
                      room_id: data.room || idea.room_hash_id,
                      title: data.title,
                      content: data.content,
                    })
                  }
                  renderForm={({ onSubmit, onCancel }) => (
                    <IdeaForm
                      defaultValues={idea}
                      contextRoomId={idea.room_hash_id}
                      contextBoxId=""
                      onSubmit={onSubmit}
                      onCancel={onCancel}
                    />
                  )}
                  onChanged={onChanged}
                  onOpen={close}
                />
                <DeleteButton
                  scopeLabel={t('scopes.ideas.name')}
                  subject={idea.title}
                  hidden={!checkPermissions('ideas', 'delete', idea.user_hash_id)}
                  onConfirm={() => deleteIdea(idea.hash_id)}
                  onDeleted={onChanged}
                  onOpen={close}
                  confirmTestId={TEST_IDS.DELETE_IDEA_CONFIRM}
                  cancelTestId={TEST_IDS.DELETE_IDEA_CANCEL}
                />
                <ReportButton scopeLabel={t('scopes.ideas.name')} subject={idea.title} onOpen={close} />
                <ShareButton path={ideaPath} onOpen={close} />
              </>
            )}
          </MoreOptions>
        </div>
      </div>

      {hasApprovalBar && <ApprovalBar approval={approval} className="ml-4 rounded-br-2xl" />}

      {hasVoteBar && <VoteBar vote={voting} disabled={!checkPermissions('ideas', 'vote')} className="ml-4" />}

      {hasVoteResults && (
        <VoteResults
          results={results}
          users={participants}
          className={twMerge('ml-4', !hasWinnerBar && 'rounded-br-2xl')}
        />
      )}

      {hasWinnerBar && <WinnerBar winner={winner} className="ml-4 rounded-br-2xl" />}

      {hasQuorumBar && (
        <QuorumBar
          metric={isVoting ? 'votes' : 'likes'}
          count={isVoting ? idea.number_of_votes : like.count}
          users={participants}
          quorum={quorum}
          color={status?.tone ?? getPhaseColor(phase_id)}
          className="ml-4 rounded-br-2xl"
        />
      )}

      <div className="flex justify-between items-center gap-6 mr-1">
        <UserBar name={idea.displayname} date={idea.created} />

        <div className="flex items-center">
          <Stat
            icon="discussion"
            count={idea.sum_comments}
            label={t(idea.sum_comments === 1 ? 'v2.scopes.ideas.stats.comment' : 'v2.scopes.ideas.stats.comments', {
              count: idea.sum_comments,
            })}
            readOnly={detail}
            to={ideaPath}
          />
          {!isVoting && <LikeStat like={like} readOnly={!canLike} data-testid={TEST_IDS.LIKE_BUTTON} />}
        </div>
      </div>
    </article>
  );
};

export default Idea;
