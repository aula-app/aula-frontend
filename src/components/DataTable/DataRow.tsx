import { StatusTypes } from '@/types/Generics';
import { SettingType } from '@/types/Scopes';
import { Checkbox, TableCell, TableRow, TableRowProps, useTheme } from '@mui/material';
import { deepOrange, deepPurple, grey, orange } from '@mui/material/colors';
import { ReactNode } from 'react';

interface Props extends TableRowProps {
  children: ReactNode;
  item: SettingType;
  selected?: boolean;
  status: StatusTypes;
  toggleRow: (id: string) => void;
}

const DataRow: React.FC<Props> = ({ children, item, selected = false, status, toggleRow, sx, ...restOfProps }) => {
  const theme = useTheme();
  const isFixed = (): boolean => 'room_name' in item && 'type' in item && Number(item.type) === 1; // determine fixed rooms

  const getBackground = () => {
    switch (status) {
      case 0:
        return selected ? deepOrange[100] : deepOrange[50];
      case 2:
        return selected ? deepPurple[100] : deepPurple[50];
      case 3:
        return selected ? orange[100] : orange[50];
      default:
        return selected ? grey[100] : theme.palette.background.default;
    }
  };

  return (
    <TableRow
      hover
      sx={{
        background: getBackground(),
        cursor: 'pointer',
        textDecorationLine: status !== 1 ? 'line-through' : 'none',
        height: '55px',
        ...sx,
      }}
      {...restOfProps}
    >
      <TableCell sx={{ position: 'sticky', width: 25, left: 0, zIndex: 2, pl: 1, pr: 0, background: 'inherit' }}>
        {!('userlevel' in item && item.userlevel >= 50) && (
          <Checkbox
            checked={selected}
            onChange={() => {
              if (!isFixed()) toggleRow(String(item.hash_id));
            }}
            disabled={isFixed()}
          />
        )}
      </TableCell>
      {children}
    </TableRow>
  );
};

export default DataRow;
