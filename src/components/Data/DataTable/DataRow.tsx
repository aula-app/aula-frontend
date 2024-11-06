import { StatusTypes } from '@/types/Generics';
import { PossibleFields } from '@/types/Scopes';
import { Checkbox, SxProps, TableCell, TableRow, Theme } from '@mui/material';
import { deepOrange, deepPurple, grey, orange } from '@mui/material/colors';
import { ReactNode } from 'react';

type Params = {
  id: number;
  status: StatusTypes;
  selected?: boolean;
  toggleRow: (id: number) => void;
  children: ReactNode;
  sx?: SxProps<Theme>;
};

const DataRow = ({ id, selected = false, toggleRow, status, children, sx, ...restOfProps }: Params) => {
  const getBackground = () => {
    switch (status) {
      case 0:
        return selected ? deepOrange[100] : deepOrange[50];
      case 2:
        return selected ? deepPurple[100] : deepPurple[50];
      case 3:
        return selected ? orange[100] : orange[50];
      default:
        return selected ? grey[100] : '';
    }
  };

  return (
    <TableRow
      hover
      sx={{
        background: getBackground,
        cursor: 'pointer',
        textDecorationLine: status !== 1 ? 'line-through' : 'none',
        ...sx,
      }}
      {...restOfProps}
    >
      <TableCell>
        <Checkbox checked={selected} onChange={() => toggleRow(id)} />
      </TableCell>
      {children}
    </TableRow>
  );
};

export default DataRow;
