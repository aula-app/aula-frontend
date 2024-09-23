import { StatusTypes } from '@/types/Generics';
import { PossibleFields } from '@/types/Scopes';
import { Checkbox, TableCell, TableRow } from '@mui/material';
import { deepOrange, deepPurple, grey, orange } from '@mui/material/colors';
import { ReactNode } from 'react';

type Params = {
  row: PossibleFields;
  selected: number[];
  toggleRow: (id: number) => void;
  status: StatusTypes;
  children: ReactNode;
};

const DataRow = ({ row, selected, toggleRow, status, children }: Params) => {
  const getBackground = () => {
    switch (status) {
      case 0:
        return selected.includes(row.id) ? deepOrange[100] : deepOrange[50];
      case 2:
        return selected.includes(row.id) ? deepPurple[100] : deepPurple[50];
      case 3:
        return selected.includes(row.id) ? orange[100] : orange[50];
      default:
        return selected.includes(row.id) ? grey[100] : '';
    }
  };

  return (
    <TableRow
      hover
      sx={{
        background: getBackground,
        cursor: 'pointer',
        textDecorationLine: status !== 1 ? 'line-through' : 'none',
      }}
    >
      <TableCell>
        <Checkbox checked={selected.includes(row.id)} onChange={() => toggleRow(row.id)} />
      </TableCell>
      {children}
    </TableRow>
  );
};

export default DataRow;
