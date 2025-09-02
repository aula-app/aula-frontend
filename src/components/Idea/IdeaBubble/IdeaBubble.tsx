import AppIconButton from '@/components/AppIconButton';
import AppLink from '@/components/AppLink';
import ShareButton from '@/components/Buttons/ShareButton';
import ChatBubble from '@/components/ChatBubble';
import MarkdownReader from '@/components/MarkdownReader';
import MoreOptions from '@/components/MoreOptions';
import { IdeaType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import { Stack, StackProps, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import LikeButton from '../../Buttons/LikeButton';
import CategoryList from '../CategoryList';
import UserBar from '../UserBar';

interface Props extends Omit<StackProps, 'children'> {
  idea: IdeaType;
  to?: string;
  onDelete: () => void;
  onEdit: () => void;
  disabled?: boolean;
  children?: ReactNode;
}

const IdeaBubble: React.FC<Props> = ({ children, idea, to, disabled = false, onDelete, onEdit, ...restOfProps }) => {
  const { idea_id } = useParams();
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <Stack data-testid={`idea-${idea.title}`} width="100%" sx={{ scrollSnapAlign: 'center' }} {...restOfProps}>
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
            {/* {(Object.keys(fields) as Array<keyof CustomFieldsType>).map((customField) => (
                <Fragment key={customField}>
                {fields[customField] && idea[customField] && (
                  <Typography mt={2}>
                  <b>{fields[customField]}:</b> {idea[customField]}
                  </Typography>
                  )}
                  </Fragment>
                  ))} */}
            {children}
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
              <LikeButton disabled={disabled || !checkPermissions('ideas', 'like', idea.user_hash_id)} item={idea} />
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
