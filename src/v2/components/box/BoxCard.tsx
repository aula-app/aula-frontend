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
import ProgressBar from '@/v2/components/ui/ProgressBar';
import MoreOptions from '@/v2/components/ui/MoreOptions';
import Link from '@/v2/components/navigation/Link';
import { BoxForm } from '@/v2/forms';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

interface BoxCardProps {
  box: BoxType;
  /** Refetch the surrounding list after an edit or delete. */
  onChanged?: () => void;
}

const phaseProgress = (box: BoxType): { days: number; remaining: number } => {
  // The current phase's countdown runs from when that phase started, not from
  // the box creation date. `phase_start` is reset by the backend whenever the
  // phase changes; fall back to `created` for boxes created before that field
  // existed.
  const phaseIndex = Number(box.phase_id) / 10;
  const phaseKey = `phase_duration_${phaseIndex}` as `phase_duration_${0 | 1 | 2 | 3 | 4}`;
  const days = Number(box[phaseKey]) || 0;

  const endDate = new Date(box.phase_start ?? box.created);
  endDate.setDate(endDate.getDate() + days);
  const remaining = Math.round((Number(endDate) - Date.now()) / 86400000);

  return { days, remaining };
};

const BoxCard = ({ box, onChanged }: BoxCardProps) => {
  const { t } = useTranslation();
  const phaseColor = phases[box.phase_id] ?? 'wild';
  const to = `/room/${box.room_hash_id}/phase/${box.phase_id}/idea-box/${box.hash_id}`;

  const showCountdown = [10, 30].includes(Number(box.phase_id));
  const { days, remaining } = phaseProgress(box);
  const fillPercent = days > 0 ? Math.min(100, Math.max(0, (remaining / days) * 100)) : 0;

  return (
    <div data-testid={TEST_IDS.BOX_CARD}>
      <div
        className={twMerge(
          `relative flex flex-col rounded-t-2xl text-foreground bg-${phaseColor} flex flex-col gap-2 px-4 pt-2 pb-3 rounded-t-2xl mb-1`,
          box.ideas_num > 0 && 'rounded-bl-2xl'
        )}
      >
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
                  <BoxForm
                    defaultValues={box}
                    contextRoomId={box.room_hash_id}
                    onSubmit={onSubmit}
                    onCancel={onCancel}
                  />
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
        <Link to={to} data-testid={`box-${box.name}`} className="flex flex-col no-underline text-foreground">
          {box.name && <h2 className="font-bold">{box.name}</h2>}
          {box.description_public && (
            <Markdown className="prose-sm text-muted line-clamp-3">{box.description_public}</Markdown>
          )}
        </Link>
      </div>
      <div className="flex gap-2">
        {box.ideas_num > 0 && (
          <div className="flex items-center gap-1 ml-2">
            <Icon type={phaseColor} aria-hidden="true" />
            <span className="text-sm font-medium truncate">{box.ideas_num}</span>
          </div>
        )}
        {showCountdown && (
          <ProgressBar
            value={fillPercent}
            color={phaseColor}
            label={remaining > 0 ? t('phases.end', { var: remaining }) : t('phases.ended')}
            className="rounded-b-2xl flex-1"
          >
            <Icon type="clock" size="1rem" />
            {remaining > 0 ? t('phases.end', { var: remaining }) : t('phases.ended')}
          </ProgressBar>
        )}
      </div>
    </div>
  );
};

export default BoxCard;
