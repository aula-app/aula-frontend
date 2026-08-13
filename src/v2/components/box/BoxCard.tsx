import { deleteBox, editBox } from '@/services/boxes';
import { BoxType } from '@/types/Scopes';
import { TEST_IDS } from '@/test-ids';
import { checkPermissions, phases } from '@/utils';
import DeleteButton from '@/v2/components/button/DeleteButton';
import EditButton from '@/v2/components/button/EditButton';
import ReportButton from '@/v2/components/button/ReportButton';
import ShareButton from '@/v2/components/button/ShareButton';
import Icon from '@/v2/components/ui/Icon/Icon';
import Markdown from '@/v2/components/ui/Markdown';
import MoreOptions from '@/v2/components/ui/MoreOptions';
import Link from '@/v2/components/navigation/Link';
import { BoxForm } from '@/v2/forms';
import { useTranslation } from 'react-i18next';

interface BoxCardProps {
  box: BoxType;
  /** Refetch the surrounding list after an edit or delete. */
  onChanged?: () => void;
}

const BoxCard = ({ box, onChanged }: BoxCardProps) => {
  const { t } = useTranslation();
  const phaseColor = phases[box.phase_id] ?? 'wild';
  const to = `/room/${box.room_hash_id}/phase/${box.phase_id}/idea-box/${box.hash_id}`;

  const ideasCount = `${box.ideas_num} ${t(box.ideas_num === 1 ? 'v2.scopes.ideas.singular' : 'v2.scopes.ideas.plural')}`;
  const ideasInPhase = t(`phases.id-${box.phase_id}`, { var: ideasCount, defaultValue: ideasCount });

  return (
    <div className="relative flex flex-col rounded-2xl border border-muted text-foreground">
      <header className={`flex justify-between bg-${phaseColor} rounded-t-2xl p-2 pr-10`}>
        <div className="flex items-center gap-2">
          <Icon type={phaseColor} size="1.5rem" aria-hidden="true" />
          <span className="text-sm font-medium truncate">{ideasInPhase}</span>
        </div>
        <MoreOptions
          className="absolute top-0.5 right-1.5"
          panelClassName="mr-1"
          menuTestId={TEST_IDS.BOX_MORE_MENU}
          panelTestId={TEST_IDS.BOX_MORE_OPTIONS_PANEL}
        >
          {(close) => (
            <>
              <EditButton
                scopeLabel={t('scopes.boxes.name')}
                subject={box.name}
                hidden={!checkPermissions('boxes', 'edit')}
                onSave={(data) =>
                  editBox({
                    topic_id: box.hash_id,
                    room_id: data.room || box.room_hash_id,
                    phase_id: Number(data.phase_id),
                    name: data.name,
                    description_public: data.description_public,
                  })
                }
                renderForm={({ onSubmit, onCancel }) => (
                  <BoxForm defaultValues={box} contextRoomId={box.room_hash_id} onSubmit={onSubmit} onCancel={onCancel} />
                )}
                onChanged={onChanged}
                onOpen={close}
              />
              <DeleteButton
                scopeLabel={t('scopes.boxes.name')}
                subject={box.name}
                hidden={!checkPermissions('boxes', 'delete')}
                onConfirm={() => deleteBox(box.hash_id)}
                onDeleted={onChanged}
                onOpen={close}
                confirmTestId={TEST_IDS.DELETE_BOX_CONFIRM}
                cancelTestId={TEST_IDS.DELETE_BOX_CANCEL}
              />
              <ReportButton scopeLabel={t('scopes.boxes.name')} subject={box.name} onOpen={close} />
              <ShareButton
                path={`/room/${box.room_hash_id}/phase/${box.phase_id}/idea-box/${box.hash_id}`}
                onOpen={close}
              />
            </>
          )}
        </MoreOptions>
      </header>
      <Link to={to} data-testid={`box-${box.name}`} className=" flex flex-col no-underline text-foreground">
        <div className="flex flex-col gap-2 p-4">
          {box.name && <h2 className="font-bold">{box.name}</h2>}
          {box.description_public && (
            <Markdown className="prose-sm text-muted line-clamp-3">{box.description_public}</Markdown>
          )}
        </div>
      </Link>
    </div>
  );
};

export default BoxCard;
