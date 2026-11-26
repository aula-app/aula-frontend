import { deleteComment, editComment } from '@/services/comments';
import { TEST_IDS } from '@/test-ids';
import { CommentType } from '@/types/Scopes';
import { RoomPhases } from '@/types/SettingsTypes';
import { checkPermissions } from '@/utils';
import DeleteButton from '@/v2/components/button/DeleteButton';
import EditButton from '@/v2/components/button/EditButton';
import ReportButton from '@/v2/components/button/ReportButton';
import ShareButton from '@/v2/components/button/ShareButton';
import Avatar from '@/v2/components/idea/Avatar';
import LikeStat from '@/v2/components/idea/LikeStat';
import UserMeta from '@/v2/components/idea/UserMeta';
import DateText from '@/v2/components/ui/DateText';
import Markdown from '@/v2/components/ui/Markdown';
import MoreOptions from '@/v2/components/ui/MoreOptions';
import { CommentForm } from '@/v2/forms';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { useCommentLike } from './useCommentLike';

interface CommentProps {
  comment: CommentType;
  className?: string;
  /** Refetch the surrounding list after an edit, delete or new like. */
  onChanged?: () => void;
}

const Comment = ({ comment, className, onChanged }: CommentProps) => {
  const { t } = useTranslation();
  const { phase } = useParams<{ phase: `${RoomPhases}` }>();
  const { pathname } = useLocation();

  // Comments close along with the idea once approval starts.
  const canLike = Number(phase || '0') < 20 && checkPermissions('comments', 'like', comment.user_hash_id);
  const like = useCommentLike(comment);
  const scopeLabel = t('scopes.comments.name');

  return (
    <article
      aria-label={t('v2.scopes.comments.by', { name: comment.displayname })}
      data-testid="comment-bubble"
      className={twMerge('grid grid-cols-[auto_1fr] items-center gap-x-2', className)}
    >
      <Avatar name={comment.displayname} />

      <div className="flex items-start justify-between gap-2 min-w-0 mr-1">
        <UserMeta name={comment.displayname} />
        <MoreOptions
          className="-mt-2"
          panelClassName="ml-auto"
          menuTestId={TEST_IDS.COMMENT_MORE_MENU}
          panelTestId={TEST_IDS.COMMENT_MORE_OPTIONS_PANEL}
        >
          {(close) => (
            <>
              <EditButton
                scopeLabel={scopeLabel}
                subject={comment.displayname}
                hidden={!checkPermissions('comments', 'edit', comment.user_hash_id)}
                onSave={(data) => editComment({ comment_id: comment.hash_id, content: data.content })}
                renderForm={({ onSubmit, onCancel }) => (
                  <CommentForm defaultValues={comment} onSubmit={onSubmit} onCancel={onCancel} />
                )}
                onChanged={onChanged}
                onOpen={close}
              />
              <DeleteButton
                scopeLabel={scopeLabel}
                subject={comment.displayname}
                hidden={!checkPermissions('comments', 'delete', comment.user_hash_id)}
                onConfirm={() => deleteComment(comment.id)}
                onDeleted={onChanged}
                onOpen={close}
                confirmTestId={TEST_IDS.CONFIRM_BUTTON}
                cancelTestId={TEST_IDS.CANCEL_BUTTON}
              />
              <ReportButton scopeLabel={scopeLabel} subject={comment.content} onOpen={close} />
              <ShareButton path={pathname} onOpen={close} />
            </>
          )}
        </MoreOptions>
      </div>

      <div className="-mt-2 col-start-2 min-w-0 py-2 px-4 rounded-2xl rounded-tl-none bg-neutral text-neutral-fg">
        <Markdown className="prose text-inherit">{comment.content}</Markdown>
      </div>

      <div className="col-start-2 flex justify-between items-center gap-6 mx-1">
        <DateText date={comment.created} className="pb-3" />
        <LikeStat like={like} readOnly={!canLike} data-testid={TEST_IDS.LIKE_BUTTON} />
      </div>
    </article>
  );
};

export default Comment;
