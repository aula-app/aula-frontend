import { CandidateKind, MergeCandidate } from '@/services/idpMigration';
import {
  Checkbox,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

type Props = {
  kind: CandidateKind;
  rows: MergeCandidate[];
  total: number;
  page: number;
  perPage: number;
  search: string;
  onSearch: (value: string) => void;
  onPage: (page: number) => void;
  onToggle: (row: MergeCandidate, merge: boolean) => void;
};

/**
 * The three buckets of a merge proposal, in one table.
 *
 * A row with both sides filled is a proposed merge. One side empty means the
 * person or room exists only there: on the provider they become a new row, in
 * aula they carry on untouched and can still be claimed by their owner later.
 *
 * Only confident pairings arrive checked. An ambiguous one is a question, and
 * pre-ticking it would answer the question for the admin — which is the one
 * thing this screen exists to avoid.
 */
const ReviewTable: React.FC<Props> = ({ kind, rows, total, page, perPage, search, onSearch, onPage, onToggle }) => {
  const { t } = useTranslation();

  return (
    <Stack gap={2}>
      <TextField
        size="small"
        label={t('idp.sync.search')}
        value={search}
        onChange={(event) => onSearch(event.target.value)}
        // A school of any size makes scrolling useless; searching is the
        // only realistic way to find a particular person.
        data-testid={`idp-review-search-${kind}`}
      />

      <Table size="small" data-testid={`idp-review-table-${kind}`}>
        <TableHead>
          <TableRow>
            <TableCell>{t('idp.sync.columns.aula')}</TableCell>
            <TableCell>{t('idp.sync.columns.provider')}</TableCell>
            <TableCell>{t('idp.sync.columns.state')}</TableCell>
            <TableCell align="center">{t('idp.sync.columns.merge')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            const mergeable = !!row.idp_id && !!row.local_id;

            return (
              <TableRow key={row.id} hover data-testid={`idp-review-row-${row.id}`}>
                <TableCell>{row.local_name ?? <Typography color="text.disabled">—</Typography>}</TableCell>
                <TableCell>{row.idp_name ?? <Typography color="text.disabled">—</Typography>}</TableCell>
                <TableCell>
                  {row.idp_name_kind === 'pseudonym' ? (
                    // Says why this one can never match: the provider gave a
                    // stand-in name, not the person's own.
                    <Chip size="small" color="warning" label={t('idp.sync.state.pseudonym')} />
                  ) : (
                    <Chip
                      size="small"
                      color={
                        row.outcome === 'confident' ? 'success' : row.outcome === 'ambiguous' ? 'warning' : 'default'
                      }
                      label={t(`idp.sync.state.${row.outcome}`)}
                    />
                  )}
                </TableCell>
                <TableCell align="center">
                  {mergeable ? (
                    <Checkbox
                      checked={row.decision === 'merge'}
                      onChange={(event) => onToggle(row, event.target.checked)}
                      inputProps={{ 'aria-label': t('idp.sync.columns.merge') }}
                      data-testid={`idp-review-merge-${row.id}`}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {row.idp_id ? t('idp.sync.willBeCreated') : t('idp.sync.staysInAula')}
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={total}
        page={page - 1}
        rowsPerPage={perPage}
        rowsPerPageOptions={[perPage]}
        onPageChange={(_, next) => onPage(next + 1)}
      />
    </Stack>
  );
};

export default ReviewTable;
