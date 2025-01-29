import AppIconButton from '@/components/AppIconButton';
import AppLink from '@/components/AppLink';
import ChatBubble from '@/components/ChatBubble';
import MoreOptions from '@/components/MoreOptions';
import { IdeaType } from '@/types/Scopes';
import { checkPermissions, checkSelf } from '@/utils';
import { Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';
import CategoryList from '../CategoryList';
import LikeButton from '../LikeButton';
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
            <Typography>{idea.content}</Typography>
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
            canEdit={checkPermissions(30) || (checkPermissions(20) && checkSelf(idea.user_id) && !disabled)}
          >
            <Stack direction="row" alignItems="center">
              <LikeButton disabled={disabled} item={idea} />
              {idea.sum_comments > 0 && (
                <AppIconButton icon="chat" to={`/idea/${idea.hash_id}`} disabled={disabled}>
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
