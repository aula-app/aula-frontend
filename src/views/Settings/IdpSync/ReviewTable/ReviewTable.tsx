import Icon from '@/components/new/Icon/Icon';
import { CandidateKind, MergeCandidate } from '@/services/idpMigration';
import { useTranslation } from 'react-i18next';
import SortSelect from '@/v2/components/input/SortSelect';
import TextInput from '@/v2/components/input/TextInput';
import { useListSort } from '@/v2/hooks/useListSort';
import { isPair, Members, resultOf, rivalsOf, rowKind, SORTS } from './candidates';
import MatchCell from './MatchCell';
import MemberCount from './MemberCount';
import EntityMeta from './EntityMeta';
import { CARD, CHIP, CONTENT, toneFor } from './styles';
import { useMatching } from './useMatching';

type Props = {
  kind: CandidateKind;
  /** Arranged; sorted and paged here. */
  rows: MergeCandidate[];
  page: number;
  perPage: number;
  search: string;
  onSearch: (value: string) => void;
  onPage: (page: number) => void;
  /** Arranged and unfiltered, for other pairs proposing the same aula record. */
  all: MergeCandidate[];
  /** Repoints `row` at an aula record, or frees it when given null. */
  onAssign: (row: MergeCandidate, localId: number | null) => void;
  /** Confirms a proposed pair. */
  onConfirm: (row: MergeCandidate) => void;
  /** Why apply refused a row, by row id. */
  problems?: Record<number, string>;
  filter?: React.ReactNode;
  /** Rooms only, by row id. */
  members?: Map<number, Members>;
};

const ReviewTable: React.FC<Props> = ({
  kind,
  rows,
  page,
  perPage,
  search,
  onSearch,
  onPage,
  all,
  onAssign,
  onConfirm,
  problems = {},
  filter,
  members,
}) => {
  const { t } = useTranslation();
  const matching = useMatching(onAssign);

  const isPerson = kind === 'user';
  const { sorted, orderBy, setOrderBy, reversed, setReversed } = useListSort(rows, SORTS, 'name');
  // Rows apply refused come first, so they can be found. Picking does not reorder or drop rows:
  // the table has to hold still while a card is in the air, so invalid rows stay as faded holes.
  const visible = [...sorted.filter((row) => problems[row.id]), ...sorted.filter((row) => !problems[row.id])];

  const pages = Math.max(1, Math.ceil(visible.length / perPage));
  const current = Math.min(page, pages);
  const shown = visible.slice((current - 1) * perPage, current * perPage);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2" data-keeps-pick>
        <div className="w-64">
          <TextInput
            dense
            type="search"
            label={t('v2.ui.idpSync.search')}
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            startAdornment={<Icon type="search" size="1.1em" />}
            data-testid={`idp-review-search-${kind}`}
          />
        </div>

        {filter}

        <SortSelect
          options={Object.keys(SORTS).map((key) => ({ value: key, label: t(`v2.ui.sort.${key}`) }))}
          value={orderBy}
          onChange={setOrderBy}
          reversed={reversed}
          onReverse={() => setReversed(!reversed)}
          data-testid={`idp-review-sort-${kind}`}
        />
      </div>

      {/* Cancels border-spacing on the outer edge. */}
      <div className="-mx-1 sm:-mx-2">
        <table
          // No own scroller: its bar would sit under the last row.
          className="w-full min-w-2xl table-fixed border-separate border-spacing-x-1 border-spacing-y-2 text-sm sm:border-spacing-x-2"
          data-testid={`idp-review-table-${kind}`}
        >
          <thead>
            <tr className="text-left opacity-70">
              <th scope="col" className="px-3 font-normal">
                {t('v2.ui.idpSync.columns.aula')}
              </th>
              <th scope="col" className="px-3 font-normal">
                {t('v2.ui.idpSync.columns.provider')}
              </th>
              <th scope="col" className="px-3 font-normal">
                {t('v2.ui.idpSync.columns.merged')}
              </th>
            </tr>
          </thead>
          <tbody>
            {shown.map((row) => {
              const kindOfRow = rowKind(row);
              const tone = toneFor(kindOfRow, isPerson);
              const rowMembers = members?.get(row.id);
              const rivals = kindOfRow === 'pending' ? rivalsOf(all, row).length : 0;
              const problem = problems[row.id];

              return (
                <tr
                  key={row.id}
                  className={`transition-opacity ${matching.isMuted(row) ? 'opacity-40' : ''}`}
                  data-testid={`idp-review-row-${row.id}`}
                >
                  <MatchCell
                    row={row}
                    side="aula"
                    tone={tone}
                    matching={matching}
                    isPerson={isPerson}
                    connector="plus"
                    members={rowMembers}
                  />
                  <MatchCell
                    row={row}
                    side="provider"
                    tone={tone}
                    matching={matching}
                    isPerson={isPerson}
                    connector="equals"
                    members={rowMembers}
                  />

                  <td className={`${CARD} ${tone} ${problem ? 'ring-2 ring-error-fg' : ''}`}>
                    <span className={`flex items-center gap-2 min-w-0 ${CONTENT}`}>
                      <EntityMeta
                        {...resultOf(row, isPerson)}
                        detailEnd={
                          rowMembers && (
                            <MemberCount
                              members={rowMembers.merged}
                              label={t('v2.ui.idpSync.showMembers')}
                              data-testid={`idp-review-members-merged-${row.id}`}
                            />
                          )
                        }
                      />
                      {isPair(row) && (
                        <span className="ml-auto flex shrink-0 items-center gap-1">
                          {kindOfRow === 'pending' && (
                            <button
                              type="button"
                              className={`${CHIP} flex items-center gap-1`}
                              onClick={() => onConfirm(row)}
                              data-testid={`idp-review-confirm-${row.id}`}
                            >
                              <Icon type="check" size="1.1em" />
                              {t('v2.ui.idpSync.actions.confirm')}
                            </button>
                          )}
                          <button
                            type="button"
                            className={`${CHIP} flex items-center gap-1`}
                            onClick={() => onAssign(row, null)}
                            data-testid={`idp-review-unlink-${row.id}`}
                          >
                            <Icon type="unlink" size="1.1em" />
                            {t('v2.ui.idpSync.actions.unlink')}
                          </button>
                        </span>
                      )}
                    </span>
                    {(kindOfRow === 'pending' || !!problem) && (
                      <p className="mb-0! px-3 pb-2 text-xs font-bold" data-testid={`idp-review-note-${row.id}`}>
                        {problem
                          ? t(`v2.ui.idpSync.problems.${problem}`, t('v2.ui.idpSync.problems.default'))
                          : rivals > 0
                            ? t('v2.ui.idpSync.pendingContested', { count: rivals })
                            : t('v2.ui.idpSync.pending')}
                      </p>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex items-center gap-3 self-end text-sm">
          <button
            type="button"
            className={`${CHIP} disabled:opacity-40`}
            disabled={current <= 1}
            onClick={() => onPage(current - 1)}
          >
            {t('ui.common.back')}
          </button>
          <span className="opacity-70">{`${current} / ${pages}`}</span>
          <button
            type="button"
            className={`${CHIP} disabled:opacity-40`}
            disabled={current >= pages}
            onClick={() => onPage(current + 1)}
          >
            {t('ui.common.next')}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewTable;
