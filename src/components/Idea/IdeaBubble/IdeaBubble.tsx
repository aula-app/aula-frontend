import AppIconButton from '@/components/AppIconButton';
import AppLink from '@/components/AppLink';
import ShareButton from '@/components/Buttons/ShareButton';
import ChatBubble from '@/components/ChatBubble';
import MarkdownReader from '@/components/MarkdownReader';
import MoreOptions from '@/components/MoreOptions';
import { IdeaType } from '@/types/Scopes';
import { checkPermissions, phases } from '@/utils';
import { Stack, StackProps, Typography } from '@mui/material';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import LikeButton from '../../Buttons/LikeButton';
import CategoryList from '../CategoryList';
import UserBar from '../UserBar';
import VotingQuorum from '../VotingQuorum';
import { RoomPhases } from '@/types/SettingsTypes';
import VotingResults from '../VotingResults';
import VotingCard from '../VotingCard';

interface Props extends Omit<StackProps, 'children'> {
  idea: IdeaType;
  quorum?: number;
  phase: RoomPhases;
  to?: string;
  onDelete: () => void;
  onEdit: () => void;
  onReload?: () => void;
  disabled?: boolean;
  children?: ReactNode;
}

const IdeaBubble: React.FC<Props> = ({
  children,
  idea,
  quorum,
  phase,
  to,
  disabled = false,
  onDelete,
  onEdit,
  onReload = () => {},
  ...restOfProps
}) => {
  const { idea_id } = useParams();
  const location = useLocation();
  const { t } = useTranslation();

  const [numLikes, setNumLikes] = useState(Number(phase) >= 30 ? Number(idea.number_of_votes) : Number(idea.sum_likes));
  const updateLikes = (delta: number) => {
    setNumLikes(() => (Number(phase) >= 30 ? Number(idea.number_of_votes) : Number(idea.sum_likes)) + delta);
  };

  return (
    <Stack data-testid={`idea-${idea.title}`} width="100%" sx={{ scrollSnapAlign: 'center' }} {...restOfProps}>
      {phase === 30 && idea.approved > 0 && <VotingCard onChange={updateLikes} />}
      {phase === 40 && <VotingResults idea={idea} onReload={onReload} quorum={quorum} />}
      <ChatBubble disabled={disabled} comment={idea.approved < 0}>
        <AppLink to={to} disabled={!to || disabled}>
          <Stack
            gap={1}
            overflow="clip"
            sx={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
          >
            <span>
              <Typography variant="h3" display="inline">
                {idea.title}
              </Typography>
              <CategoryList idea={idea} />
            </span>
            <MarkdownReader>{idea.content}</MarkdownReader>
            {children}
            {quorum !== undefined && typeof phase === 'number' && idea.approved >= 0 && (
              <VotingQuorum quorum={quorum} phase={phase} votes={numLikes} users={Number(idea.number_of_users)} />
            )}
          </Stack>
        </AppLink>
      </ChatBubble>
      <Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <UserBar info={idea} />
          <MoreOptions
            item={idea}
            scope="ideas"
            onDelete={onDelete}
            data-testid="idea-more-menu"
            onEdit={onEdit}
            link={`${location.pathname}/${to}`}
          >
            <Stack direction="row" alignItems="center">
              <ShareButton idea={idea} />
              <LikeButton
                disabled={disabled || !checkPermissions('ideas', 'like', idea.user_hash_id)}
                item={idea}
                onChange={updateLikes}
              />
              {idea.sum_comments > 0 && !idea_id && (
                <AppIconButton icon="chat" title={t('tooltips.chat')} to={to} disabled={disabled}>
                  {idea.sum_comments}
                </AppIconButton>
              )}
            </Stack>
          </MoreOptions>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default IdeaBubble;
