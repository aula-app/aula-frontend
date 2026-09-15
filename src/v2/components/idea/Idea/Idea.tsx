import { deleteIdea, editIdea } from '@/services/ideas';
import { IdeaType } from '@/types/Scopes';
import { RoomPhases } from '@/types/SettingsTypes';
import { checkPermissions, Vote } from '@/utils';
import DeleteButton from '@/v2/components/button/DeleteButton';
import EditButton from '@/v2/components/button/EditButton';
import ReportButton from '@/v2/components/button/ReportButton';
import ShareButton from '@/v2/components/button/ShareButton';
import PhaseStatus, { getPhaseColor, getPhaseColors, getPhaseStatus } from '@/v2/components/idea/PhaseStatus';
import QuorumBar from '@/v2/components/idea/QuorumBar';
import CategoryList, { Category } from '@/v2/components/idea/CategoryList';
import LikeStat from '@/v2/components/idea/LikeStat';
import { IdeaForm } from '@/v2/forms';
import Stat from '@/v2/components/idea/Stat';
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
  className?: string;
  onChanged?: () => void;
}

const Idea = ({ idea, categories = [], vote, quorum, className, onChanged }: IdeaProps) => {
  const { t } = useTranslation();
  const { phase } = useParams<{ phase: `${RoomPhases}` }>();

  const titleId = useId();
  const phase_id = phase || '0';
  const ideaPath = `/room/${idea.room_hash_id}/phase/${phase_id}/idea/${idea.hash_id}`;

  const phaseNumber = Number(phase_id);
  const isVoting = phaseNumber >= 30;
  const canLike = phaseNumber < 20;
  // A rejected idea never entered the vote, so it has no turnout to draw.
  const hasQuorumBar = isVoting && idea.approved !== -1;

  const status = getPhaseStatus({ idea, phase: phase_id, vote, quorum });
  const bubbleColor = status?.colors ?? getPhaseColors(phase_id);
  const hasTopTab = !!status || categories.length > 0;

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
        <div
          className={twMerge(
            'relative flex flex-col-reverse ml-4 gap-1 py-2 px-4 rounded-2xl rounded-bl-none',
            bubbleColor,
            hasQuorumBar ? 'rounded-br-none' : '',
            hasTopTab ? 'rounded-tr-none' : ''
          )}
        >
          <Link to={ideaPath}>
            <h2 id={titleId} className="font-semibold text-inherit">
              {idea.title}
            </h2>
            {idea.content && <Markdown className="prose text-inherit line-clamp-3">{idea.content}</Markdown>}
          </Link>
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

      {hasQuorumBar && (
        <QuorumBar
          votes={idea.number_of_votes}
          users={idea.number_of_users}
          quorum={quorum}
          color={getPhaseColor(phase_id)}
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
            to={ideaPath}
          />
          {!isVoting && <LikeStat idea={idea} readOnly={!canLike} data-testid={TEST_IDS.LIKE_BUTTON} />}
        </div>
      </div>
    </article>
  );
};

export default Idea;
