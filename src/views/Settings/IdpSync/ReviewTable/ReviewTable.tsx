import Icon from '@/components/new/Icon/Icon';
import { CandidateKind, MergeCandidate } from '@/services/idpMigration';
import { useTranslation } from 'react-i18next';
import SortSelect from '@/v2/components/input/SortSelect';
import { useListSort } from '@/v2/hooks/useListSort';
import { arrange, isPair, resultOf, rowKind, SORTS } from './candidates';
import MatchCell from './MatchCell';
import Party from './Party';
import { CARD, CHIP, CONTENT, PLAIN, toneFor } from './styles';
import { useMatching } from './useMatching';

type Props = {
  kind: CandidateKind;
  rows: MergeCandidate[];
  total: number;
  page: number;
  perPage: number;
  search: string;
  onSearch: (value: string) => void;
  onPage: (page: number) => void;
  /** Repoints `row` at an aula record, or frees it when given null. */
  onAssign: (row: MergeCandidate, localId: number | null) => void;
};

const ReviewTable: React.FC<Props> = ({ kind, rows, total, page, perPage, search, onSearch, onPage, onAssign }) => {
  const { t } = useTranslation();
  const matching = useMatching(onAssign);

  const pages = Math.max(1, Math.ceil(total / perPage));
  const isPerson = kind === 'user';
  const { sorted, orderBy, setOrderBy, reversed, setReversed } = useListSort(arrange(rows), SORTS, 'status');
  // While a record is held, everything it cannot join is taken off screen, so the
  // remaining cards are exactly the places it can go. The held record is drawn
  // from the pick itself rather than from `rows`, so searching and sorting can
  // narrow the targets beneath it without it leaving the screen.
  const visible = matching.picked
    ? [matching.picked, ...sorted.filter((row) => !matching.isPicked(row) && matching.isTarget(row))]
    : sorted;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2" data-keeps-pick>
        <label
          // The ring is on the label because the input drops its own outline.
          className={`flex items-center gap-2 self-start ${CARD} ${PLAIN} ${CONTENT} focus-within:ring-2 focus-within:ring-current/40`}
        >
          <Icon type="search" size="1.1em" className="shrink-0 opacity-70" />
          <span className="sr-only">{t('v2.ui.idpSync.search')}</span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder={t('v2.ui.idpSync.search')}
            className="bg-transparent text-sm outline-none placeholder:opacity-70"
            data-testid={`idp-review-search-${kind}`}
          />
        </label>

        <SortSelect
          options={Object.keys(SORTS).map((key) => ({ value: key, label: t(`v2.ui.sort.${key}`) }))}
          value={orderBy}
          onChange={setOrderBy}
          reversed={reversed}
          onReverse={() => setReversed(!reversed)}
          data-testid={`idp-review-sort-${kind}`}
        />
      </div>

      {/* border-spacing insets the outer edge too; the negative margin takes it back. */}
      <div className="-mx-1 sm:-mx-2">
        <table
          // No scroller of its own: the bar would sit under the last row. Past the
          // min-width the view itself scrolls sideways.
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
            {visible.map((row) => {
              const tone = toneFor(rowKind(row), isPerson);

              return (
                <tr key={row.id} data-testid={`idp-review-row-${row.id}`}>
                  <MatchCell
                    row={row}
                    side="aula"
                    tone={tone}
                    matching={matching}
                    isPerson={isPerson}
                    connector="plus"
                  />
                  <MatchCell
                    row={row}
                    side="provider"
                    tone={tone}
                    matching={matching}
                    isPerson={isPerson}
                    connector="equals"
                  />

                  <td className={`${CARD} ${tone}`}>
                    <span className={`flex items-center gap-2 min-w-0 ${CONTENT}`}>
                      <Party {...resultOf(row, isPerson)} />
                      {isPair(row) && (
                        <button
                          type="button"
                          className={`${CHIP} ml-auto flex shrink-0 items-center gap-1`}
                          onClick={() => onAssign(row, null)}
                          data-testid={`idp-review-unlink-${row.id}`}
                        >
                          <Icon type="unlink" size="1.1em" />
                          {t('v2.ui.idpSync.actions.unlink')}
                        </button>
                      )}
                    </span>
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
            disabled={page <= 1}
            onClick={() => onPage(page - 1)}
          >
            {t('ui.common.back')}
          </button>
          <span className="opacity-70">{`${page} / ${pages}`}</span>
          <button
            type="button"
            className={`${CHIP} disabled:opacity-40`}
            disabled={page >= pages}
            onClick={() => onPage(page + 1)}
          >
            {t('ui.common.next')}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewTable;
