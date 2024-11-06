import { Pagination, Stack } from '@mui/material';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';

type Params = {
  pages: number;
  setPage: Dispatch<SetStateAction<number>>;
};

const PaginationBar = ({ pages, setPage }: Params) => {
  const changePage = (event: ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage - 1);
  };

  return pages > 1 ? (
    <Stack direction="row" alignItems="center" justifyContent="center" bottom={0} height={48}>
      <Pagination count={pages} onChange={changePage} sx={{ py: 1 }} />
    </Stack>
  ) : (
    <></>
  );
};

export default PaginationBar;
