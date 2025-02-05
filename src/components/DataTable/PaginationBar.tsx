import { Pagination, Stack } from '@mui/material';
import { ChangeEvent } from 'react';

type Props = {
  pages: number;
  setPage: (page: number) => void;
};

const PaginationBar: React.FC<Props> = ({ pages, setPage }) => {
  const changePage = (event: ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage - 1);
  };

  return (
    <Stack direction="row" alignItems="center" justifyContent="center" bottom={0} height={48}>
      {pages > 1 && <Pagination count={pages} onChange={changePage} sx={{ py: 1 }} />}
    </Stack>
  );
};

export default PaginationBar;
