import { getRoom } from '@/services/rooms';
import { useAppStore } from '@/store/AppStore';
import { IdeaType } from '@/types/Scopes';
import IdeaCard from '@/v2/components/idea/Idea';
import FeedbackState from '@/v2/components/ui/FeedbackState';
import { useScrollRestoration } from '@/v2/hooks';
import { useIdeaVotes } from '@/v2/hooks/useIdeaVotes';
import { useQuorum } from '@/v2/hooks/useQuorum';
import { useRoomUsers } from '@/v2/hooks/useRoomUsers';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Comments from './Comments';
import { useIdea } from './useIdea';
import { useIdeaBox } from './useIdeaBox';

const Idea: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { room_id, phase, idea_id } = useParams<{ room_id: string; phase: string; idea_id: string }>();
  const [, dispatch] = useAppStore();

  const { idea, isLoading, error, refetch } = useIdea(idea_id);
  const { box, isLoading: isBoxLoading } = useIdeaBox(idea_id);

  // The idea's phase is the phase of the box holding it; a wild idea has none.
  const ideaPhase = isBoxLoading ? (phase ?? '0') : String(box?.phase_id ?? 0);
  const listPath = box
    ? `/room/${room_id}/phase/${ideaPhase}/idea-box/${box.hash_id}`
    : `/room/${room_id}/phase/${ideaPhase}`;

  const scrollRef = useScrollRestoration<HTMLDivElement>(`idea-${idea_id}`, !!idea);

  const quorum = useQuorum(ideaPhase);
  const users = useRoomUsers(room_id);

  // `getIdeaBaseData` returns an int `room_id` but no `room_hash_id`, and no phase. Both are
  // what the card builds its links from, so fill them from the route and the box.
  const resolved: IdeaType | null = useMemo(
    () =>
      idea && {
        ...idea,
        room_hash_id: idea.room_hash_id || room_id || '',
        phase_id: ideaPhase as IdeaType['phase_id'],
      },
    [idea, room_id, ideaPhase]
  );
  const ideaList = useMemo(() => (resolved ? [resolved] : []), [resolved]);
  const votes = useIdeaVotes(ideaList, ideaPhase === '30');

  // `:phase` is a snapshot of where the idea was when the link was made and goes stale when its
  // box moves. The card reads the param, so realign it on the box the idea is in now.
  useEffect(() => {
    if (!idea || !room_id || isBoxLoading) return;
    if (ideaPhase === phase) return;
    navigate(`${listPath}/idea/${idea.hash_id}`, { replace: true });
  }, [idea, room_id, phase, ideaPhase, isBoxLoading, listPath, navigate]);

  useEffect(() => {
    if (!idea || !room_id) return;
    getRoom(room_id).then((response) => {
      const roomName = response.data?.room_name || 'aula';
      const breadcrumb: string[][] = [
        [roomName, `/room/${room_id}/phase/0`],
        [t(`phases.name-${ideaPhase}`), `/room/${room_id}/phase/${ideaPhase}`],
      ];
      if (box) breadcrumb.push([box.name, listPath]);
      breadcrumb.push([idea.title, '']);
      dispatch({ action: 'SET_BREADCRUMB', breadcrumb });
    });
  }, [idea, box, room_id, ideaPhase, listPath, t, dispatch]);

  // Deleting the idea we are viewing leaves nothing to show — return to the list it came from.
  const handleIdeaChanged = async () => {
    const updated = await refetch();
    if (!updated) navigate(listPath);
  };

  return (
    <div ref={scrollRef} className="w-full h-full overflow-y-auto flex flex-col">
      {isLoading && (
        <p role="status" className="p-2">
          <span aria-hidden="true">...</span>
          <span className="sr-only">{t('status.loading')}</span>
        </p>
      )}

      {error && (
        <FeedbackState
          image="/img/Paula_unzufrieden.svg"
          alt={t('v2.alt.sad')}
          title={t(`v2.ui.error.${error}.title`)}
          description={t(`v2.ui.error.${error}.description`)}
          data-testid="idea-error-state"
        />
      )}

      {!isLoading && !error && resolved && (
        <>
          <div className="p-2 pb-0">
            <IdeaCard
              detail
              idea={resolved}
              vote={votes[resolved.hash_id]}
              quorum={quorum}
              users={users}
              onChanged={handleIdeaChanged}
            />
          </div>

          <Comments idea_id={resolved.hash_id} phase={ideaPhase} />
        </>
      )}
    </div>
  );
};

export default Idea;
