import Icon, { ICON_TYPE } from '@/components/new/Icon/Icon';
import { MergeCandidate } from '@/services/idpMigration';
import { useTranslation } from 'react-i18next';
import { isAulaOnly, isPair, isProviderOnly } from './candidates';
import Party from './Party';
import { CARD, CONTENT } from './styles';
import { Matching } from './useMatching';

type Side = 'aula' | 'provider';

type EmptyState = { icon: ICON_TYPE; label: string; hint?: string };

/** What an absent half means, which is not the same thing for a person and a room. */
const EMPTY: Record<Side, Record<'person' | 'room', EmptyState>> = {
  aula: {
    person: { icon: 'request', label: 'v2.ui.idpSync.state.none', hint: 'v2.ui.idpSync.state.emptyUser' },
    room: { icon: 'about', label: 'v2.ui.idpSync.willBeCreated' },
  },
  provider: {
    person: { icon: 'request', label: 'v2.ui.idpSync.state.none', hint: 'v2.ui.idpSync.state.orphaned' },
    room: { icon: 'request', label: 'v2.ui.idpSync.state.notLinked' },
  },
};

const Connector = ({ icon }: { icon: 'plus' | 'equals' }) => (
  <span
    // translate-x-1/2 only reaches the card's edge; -mr must track border-spacing-x
    // to land in the middle of the gutter.
    className="absolute top-1/2 right-0 z-10 -mr-0.5 flex -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-background p-0.5 opacity-70 sm:-mr-1"
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
  /** Users carry a display name and an avatar; rooms carry neither. */
  isPerson: boolean;
  /** Symbol to float in the gutter to this cell's right. */
  connector: 'plus' | 'equals';
}

/**
 * One half of a match, as a card.
 *
 * Kept at module scope: a component declared in a render body is a new type
 * every render, so React would replace the node mid-drag and abort the drag.
 */
const MatchCell = ({ row, side, tone, matching, isPerson, connector }: Props) => {
  const { t } = useTranslation();
  const { over, setOver, isPicked, isTarget, select, pick, place } = matching;

  const name = side === 'aula' ? row.local_name : row.idp_name;
  const source = side === 'aula' ? isAulaOnly(row) : isProviderOnly(row);
  const droppable = isTarget(row) && !name;
  const interactive = source || droppable;
  // Both cells of a row share its id; only the half holding the record is picked.
  const picked = isPicked(row) && source;

  const empty = EMPTY[side][isPerson ? 'person' : 'room'];

  const party =
    side === 'aula'
      ? {
          detail: isPerson ? (row.local_displayname ?? row.local_name ?? undefined) : undefined,
          avatar: isPerson ? (row.local_name ?? undefined) : undefined,
        }
      : {
          detail: row.idp_name_kind === 'pseudonym' ? t('v2.ui.idpSync.state.pseudonym') : undefined,
          avatar: undefined,
        };

  const content = name ? (
    <>
      {isPair(row) && <Icon type="check" size="1.25em" className="shrink-0" />}
      <Party name={name} {...party} />
    </>
  ) : (
    <span className="flex min-w-0 flex-col gap-0.5">
      <span className="flex items-center gap-2 font-bold">
        <Icon type={droppable ? 'check' : empty.icon} size="1em" className="shrink-0" />
        {droppable ? t('v2.ui.idpSync.actions.place') : t(empty.label)}
      </span>
      {!droppable && !!empty.hint && <span className="text-xs opacity-80">{t(empty.hint)}</span>}
    </span>
  );

  return (
    <td
      className={`${CARD} relative ${tone} transition-colors ${picked ? 'ring-2 ring-current' : ''} ${
        droppable
          ? // data-[over] rather than a bare class: `bg-current/10` ties with the
            // tone's own background and loses on source order.
            'outline-2 outline-dashed outline-current/50 hover:outline-solid hover:bg-current/10 focus-within:outline-solid focus-within:bg-current/10 data-[over]:outline-solid data-[over]:bg-current/10'
          : ''
      }`}
      data-over={over === row.id && droppable ? '' : undefined}
      onDragOver={
        droppable
          ? (event) => {
              // Without this the browser refuses the drop outright.
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
            // Firefox starts no drag at all unless the payload is set here.
            event.dataTransfer.setData('text/plain', String(row.id));
            event.dataTransfer.effectAllowed = 'link';
            // Always sets: dragging a card that is already picked must not clear it.
            select(row);
          }}
          onDragEnd={() => setOver(null)}
          onClick={() => (droppable ? place(row) : pick(row))}
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
