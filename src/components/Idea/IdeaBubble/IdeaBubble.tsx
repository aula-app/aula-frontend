import AppLink from '@/components/AppLink';
import ChatBubble from '@/components/ChatBubble';
import { IdeaType } from '@/types/Scopes';
import { phases } from '@/utils';
import { Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import UserBar from '../UserBar';
import CategoryList from '../CategoryList';

interface Props {
  idea: IdeaType;
  disabled?: boolean;
}

const IdeaBubble: React.FC<Props> = ({ idea, disabled = false }) => {
  const { phase } = useParams();

  return (
    <Stack width="100%" sx={{ scrollSnapAlign: 'center', mb: 2, mt: 1 }}>
      <ChatBubble color={`${phases[Number(phase)]}.main`}>
        <AppLink to={`/idea/${idea.hash_id}`} disabled={disabled}>
          <Stack gap={1}>
            <Typography variant="h6">{idea.title}</Typography>
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
            <CategoryList idea={idea} />
          </Stack>
        </AppLink>
      </ChatBubble>
      <UserBar idea={idea} />
    </Stack>
  );
};

export default IdeaBubble;
