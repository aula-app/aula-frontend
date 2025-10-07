import { Pagination, Stack, TextField, Typography } from '@mui/material';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  pages: number;
  setPage: (page: number) => void;
  limit?: number;
  setLimit?: (limit: number) => void;
};

const PaginationBar: React.FC<Props> = ({ pages, setPage, limit, setLimit }) => {
  const { t } = useTranslation();

  const changePage = (event: ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage - 1);
  };

  const changeLimit = (event: ChangeEvent<HTMLInputElement>) => {
    if (setLimit) {
      const value = Number(event.target.value);
      if (value > 0) {
        setLimit(value);
        setPage(0); // Reset to first page when limit changes
      }
    }
  };

  return pages > 1 || (limit && setLimit) ? (
    <Stack direction="row" alignItems="center" justifyContent="space-between" bottom={0} height={48}>
      {limit && setLimit && (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 2 }}>
          <Typography variant="body2">{t('ui.pagination.rowsPerPage')}</Typography>
          <TextField
            type="number"
            value={limit}
            onChange={changeLimit}
            size="small"
            slotProps={{ htmlInput: { min: 1, style: { textAlign: 'center' } } }}
            sx={{ width: 70 }}
          />
        </Stack>
      )}
      {pages > 1 && <Pagination count={pages} onChange={changePage} sx={{ py: 1 }} />}
    </Stack>
  ) : null;
};

export default PaginationBar;
