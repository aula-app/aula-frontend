import Icon from '@/components/new/Icon/Icon';
import { MergeCandidate } from '@/services/idpMigration';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { isAulaOnly, isPair, isProviderOnly, Members } from './candidates';
import MemberCount from './MemberCount';
import EntityMeta from './EntityMeta';
import { CARD, CONTENT, PLAIN } from './styles';
import { Matching } from './useMatching';

type Side = 'aula' | 'provider';

const Connector = ({ icon }: { icon: 'plus' | 'equals' }) => (
  <span
    // -mr must track border-spacing-x to centre in the gutter.
    className="absolute top-1/2 right-0 z-1 -mr-0.5 flex -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-background p-0.5 opacity-70 sm:-mr-1"
    aria-hidden="true"
  >
    <Icon type={icon} size="1.2em" />
  </span>
);

interface Props {
  row: MergeCandidate;
  side: Side;
  tone: string;
  matching: Matching;
  isPerson: boolean;
  connector: 'plus' | 'equals';
  /** Rooms only. */
  members?: Members;
}

/** Module scope: declared in a render body, it would remount and abort a drag. */
const MatchCell = ({ row, side, tone, matching, isPerson, connector, members }: Props) => {
  const { t } = useTranslation();
  const { over, setOver, isPicked, isTarget, select, pick, place } = matching;

  const name = side === 'aula' ? row.local_name : row.idp_name;
  const source = side === 'aula' ? isAulaOnly(row) : isProviderOnly(row);
  const droppable = isTarget(row) && !name;
  const interactive = source || droppable;
  // Both cells share the row id; only the half holding the record is picked.
  const picked = isPicked(row) && source;

  const list = members?.[side];
  const listId = useId();

  const meta = !isPerson
    ? {
        detailEnd: list && (
          <MemberCount id={listId} members={list} data-testid={`idp-review-members-${side}-${row.id}`} />
        ),
      }
    : side === 'aula'
      ? { detail: row.local_displayname ?? row.local_name ?? undefined, avatar: row.local_name ?? undefined }
      : { detail: row.idp_name_kind === 'pseudonym' ? t('v2.ui.idpSync.state.pseudonym') : undefined };

  const content = name ? (
    <>
      {isPair(row) && <Icon type="check" size="1.25em" className="shrink-0" />}
      <EntityMeta name={name} {...meta} />
    </>
  ) : droppable ? (
    <span className="flex items-center gap-2 font-bold">
      <Icon type="check" size="1em" className="shrink-0" />
      {t('v2.ui.idpSync.actions.place')}
    </span>
  ) : null;

  return (
    <td
      className={`${CARD} relative transition-colors ${name ? tone : `${PLAIN} ${droppable ? '' : 'border-dashed'}`} ${
        picked ? 'ring-2 ring-current' : ''
      } ${
        droppable
          ? // data-[over]: a bare `bg-current/10` loses to the tone's background.
            'outline-2 outline-dashed outline-current/50 hover:outline-solid hover:bg-current/10 focus-within:outline-solid focus-within:bg-current/10 data-[over]:outline-solid data-[over]:bg-current/10'
          : ''
      }`}
      data-over={over === row.id && droppable ? '' : undefined}
      onDragOver={
        droppable
          ? (event) => {
              // Required for the drop to be allowed.
              event.preventDefault();
              event.dataTransfer.dropEffect = 'link';
              setOver(row.id);
            }
          : undefined
      }
      onDragLeave={
        droppable
          ? (event) => {
              // Moving onto a child still fires dragleave.
              if (!event.currentTarget.contains(event.relatedTarget as Node)) setOver(null);
            }
          : undefined
      }
      onDrop={
        droppable
          ? (event) => {
              event.preventDefault();
              setOver(null);
              place(row);
            }
          : undefined
      }
    >
      {interactive ? (
        <button
          type="button"
          className={`flex w-full items-center gap-2 text-left ${CONTENT} ${source ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}`}
          draggable={source}
          onDragStart={(event) => {
            // Firefox needs a payload to start the drag.
            event.dataTransfer.setData('text/plain', String(row.id));
            event.dataTransfer.effectAllowed = 'link';
            // Not a toggle: dragging a picked card keeps it picked.
            select(row);
          }}
          onDragEnd={() => setOver(null)}
          onClick={() => (droppable ? place(row) : pick(row))}
          aria-describedby={list?.length ? listId : undefined}
          data-keeps-pick
          data-testid={`idp-review-${droppable ? 'place' : 'pick'}-${row.id}`}
        >
          {source && <Icon type="drag" size="1.1em" className="shrink-0 opacity-40" />}
          {content}
        </button>
      ) : (
        <div className={`flex items-center gap-2 ${CONTENT}`}>{content}</div>
      )}
      <Connector icon={connector} />
    </td>
  );
};

export default MatchCell;
