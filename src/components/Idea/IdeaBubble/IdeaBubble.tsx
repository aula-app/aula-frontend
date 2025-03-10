import AppIconButton from '@/components/AppIconButton';
import AppLink from '@/components/AppLink';
import ChatBubble from '@/components/ChatBubble';
import MarkdownReader from '@/components/MarkdownReader';
import MoreOptions from '@/components/MoreOptions';
import { IdeaType } from '@/types/Scopes';
import { Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import LikeButton from '../../Buttons/LikeButton';
import CategoryList from '../CategoryList';
import UserBar from '../UserBar';

interface Props {
  idea: IdeaType;
  to?: string;
  onDelete: () => void;
  onEdit: () => void;
  disabled?: boolean;
  children?: ReactNode;
}

const IdeaBubble: React.FC<Props> = ({ children, idea, to, disabled = false, onDelete, onEdit }) => {
  const { idea_id } = useParams();
  const location = useLocation();
  return (
    <Stack width="100%" sx={{ scrollSnapAlign: 'center' }}>
      <ChatBubble disabled={disabled}>
        <AppLink to={to} disabled={!to || disabled}>
          <Stack gap={1}>
            <span>
              <Typography variant="h6" display="inline">
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
            onEdit={onEdit}
            link={`${location.pathname}/${to}`}
          >
            <Stack direction="row" alignItems="center">
              <LikeButton disabled={disabled} item={idea} />
              {idea.sum_comments > 0 && !idea_id && (
                <AppIconButton icon="chat" to={to} disabled={disabled}>
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
