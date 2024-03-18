import { AccountCircle } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { IdeaBubble } from '../IdeaBubble';
import { IdeaType } from '@/types/IdeaTypes';
import { localStorageGet } from '@/utils';
import { parseJwt } from '@/utils/jwt';
import { useParams } from 'react-router-dom';
import { databaseRequest } from '@/utils/requests';
import { useEffect, useState } from 'react';

interface Props {
  idea: IdeaType;
  onReload?: () => void;
}

export const Idea = ({ idea, onReload = () => {} }: Props) => {
  const params = useParams();
  const displayDate = new Date(idea.created);

  return (
    <Stack width="100%" mb={2} sx={{scrollSnapAlign: 'center'}}>
      <IdeaBubble bubbleInfo={idea} id={Number(params['idea_id'])} onReload={onReload} />
      <Stack direction="row" alignItems="center" mt='-20px'>
        <AccountCircle sx={{ fontSize: '3em' }} />
        <Stack ml={1} maxWidth='100%' overflow='hidden'>
          <Typography variant="caption" lineHeight={1.5}>
            {displayDate.getFullYear()}/{displayDate.getMonth()}/{displayDate.getDate()}
          </Typography>
          <Typography
            variant="overline"
            overflow='hidden'
            textOverflow="ellipsis"
            fontWeight={700}
            lineHeight={1.5}
            maxWidth='100%'
            >
            {idea.displayname}
          </Typography>
        </Stack>
        {/* <Stack flexGrow={1} pr={1} direction="row" alignItems="center" justifyContent="flex-end">
          <Chip label="category" color="warning" />
        </Stack> */}
      </Stack>
    </Stack>
  );
};

export default Idea;
