import Icon from '@/components/new/Icon/Icon';
import { MergeCandidate } from '@/services/idpMigration';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { avatarUrl, isAulaOnly, isProviderOnly, Members, rowKind } from './candidates';
import MemberCount from './MemberCount';
import EntityMeta from './EntityMeta';
import { CARD, CONTENT, HOLE, PLAIN } from './styles';
import { Matching } from './useMatching';

type Side = 'aula' | 'provider';

const Connector = ({ icon }: { icon: 'plus' | 'equals' }) => (
  <span
    // -mr must track border-spacing-x to centre in the gutter.
    className="absolute top-1/2 right-0 z-1 -mr-0.5 flex -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-background p-0.5 opacity-70 sm:-mr-1"
    aria-hidden="true"
    data-connector
  >
    <Icon type={icon} size="1.2em" />
  </span>
);

/** A table cell makes an unreliable drag image: browsers place it well off the cursor. */
const dragImage = (card: HTMLElement) => {
  const { width, height } = card.getBoundingClientRect();
  const { fontFamily, fontSize, fontWeight, lineHeight, color } = getComputedStyle(card);
  const ghost = card.cloneNode(true) as HTMLElement;

  ghost.querySelector('[data-connector]')?.remove();

  Object.assign(ghost.style, {
    position: 'fixed',
    top: '0',
    left: '-100vw',
    display: 'block',
    width: `${width}px`,
    height: `${height}px`,
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
    color,
  });

  document.body.append(ghost);
  // Rasterized once the handler returns.
  setTimeout(() => ghost.remove());

  return ghost;
};

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
  const { over, setOver, isPicked, isTarget, select, pick, cancel, place } = matching;

  const name = side === 'aula' ? row.local_name : row.idp_name;
  const source = side === 'aula' ? isAulaOnly(row) : isProviderOnly(row);
  const droppable = isTarget(row) && !name;
  // Both cells share the row id; only the half holding the record is picked.
  const picked = isPicked(row) && source;
  const dropTarget = droppable || picked;
  const interactive = source || droppable;

  // Two people of one name are told apart by their classes.
  const classList = (entries?: { name: string }[] | null) =>
    entries?.length ? entries.map(({ name: entry }) => entry).join(', ') : t('v2.ui.idpSync.noClasses');

  const list = members?.[side];
  const listId = useId();

  const meta = !isPerson
    ? {
        detailEnd: list && (
          <MemberCount id={listId} members={list} data-testid={`idp-review-members-${side}-${row.id}`} />
        ),
      }
    : side === 'aula'
      ? {
          detail: row.local_displayname ?? row.local_name ?? undefined,
          avatar: row.local_name ?? undefined,
          avatarSrc: avatarUrl(row.local_avatar),
          classes: classList(row.local_rooms),
        }
      : {
          detail: row.idp_name_kind === 'pseudonym' ? t('v2.ui.idpSync.state.pseudonym') : undefined,
          classes: classList(row.idp_groups),
        };

  const content = picked ? (
    <span className="flex items-center gap-2 font-bold">
      <Icon type="close" size="1em" className="shrink-0" />
      {t('v2.ui.idpSync.actions.cancel')}
    </span>
  ) : name ? (
    <>
      {rowKind(row) === 'merge' && <Icon type="check" size="1.25em" className="shrink-0" />}
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
      className={`${CARD} relative transition-colors ${
        picked
          ? `${PLAIN} ${HOLE} text-error-fg`
          : `${name ? tone : `${PLAIN} ${droppable ? '' : 'border-dashed'}`} ${droppable ? HOLE : ''}`
      }`}
      data-over={over === row.id && dropTarget ? '' : undefined}
      onDragOver={
        dropTarget
          ? (event) => {
              // Required for the drop to be allowed.
              event.preventDefault();
              event.dataTransfer.dropEffect = 'link';
              setOver(row.id);
            }
          : undefined
      }
      onDragLeave={
        dropTarget
          ? (event) => {
              // Moving onto a child still fires dragleave.
              if (!event.currentTarget.contains(event.relatedTarget as Node)) setOver(null);
            }
          : undefined
      }
      onDrop={
        dropTarget
          ? (event) => {
              event.preventDefault();
              setOver(null);
              if (droppable) place(row);
              else cancel();
            }
          : undefined
      }
    >
      {interactive ? (
        <button
          type="button"
          className={`flex w-full items-center gap-2 text-left ${CONTENT} ${
            source && !picked ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
          }`}
          draggable={source}
          onDragStart={(event) => {
            // Firefox needs a payload to start the drag.
            event.dataTransfer.setData('text/plain', String(row.id));
            event.dataTransfer.effectAllowed = 'link';
            const card = event.currentTarget.closest('td');

            if (card) {
              const { left, top } = card.getBoundingClientRect();

              event.dataTransfer.setDragImage(dragImage(card), event.clientX - left, event.clientY - top);
            }

            // Deferred: a cell that empties mid-dragstart can abort the drag.
            setTimeout(() => select(row));
          }}
          onDragEnd={() => {
            setOver(null);
            cancel();
          }}
          onClick={() => (droppable ? place(row) : picked ? cancel() : pick(row))}
          aria-describedby={!picked && list?.length ? listId : undefined}
          data-keeps-pick
          data-testid={`idp-review-${droppable ? 'place' : picked ? 'cancel' : 'pick'}-${row.id}`}
        >
          {source && !picked && <Icon type="drag" size="1.1em" className="shrink-0 opacity-40" />}
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
