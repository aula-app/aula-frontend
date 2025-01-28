import AppLink from '@/components/AppLink';
import ChatBubble from '@/components/ChatBubble';
import { IdeaType } from '@/types/Scopes';
import { phases } from '@/utils';
import { Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import UserBar from '../UserBar';
import CategoryList from '../CategoryList';
import { deleteIdea } from '@/services/ideas';

interface Props {
  idea: IdeaType;
  onDelete: () => void;
  onEdit: () => void;
  disabled?: boolean;
}

const IdeaBubble: React.FC<Props> = ({ idea, disabled = false, onDelete, onEdit }) => {
  const { phase } = useParams();

  return (
    <Stack width="100%" sx={{ scrollSnapAlign: 'center', mb: 2, mt: 1 }}>
      <ChatBubble color={`${phases[Number(phase)]}.main`}>
        <AppLink to={`/idea/${idea.hash_id}`} disabled={disabled}>
          <Stack gap={1}>
            <Typography>
              <Typography variant="h6" display="inline">
                {idea.title}
              </Typography>
              <CategoryList idea={idea} />
            </Typography>
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
          </Stack>
        </AppLink>
      </ChatBubble>
      <UserBar idea={idea} onDelete={onDelete} onEdit={onEdit} />
    </Stack>
  );
};

export default IdeaBubble;
