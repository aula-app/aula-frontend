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

  // Helper to check if item is an object with userlevel property
  const hasUserlevel = (obj: unknown): obj is { userlevel: number } => {
    return typeof obj === 'object' && obj !== null && 'userlevel' in obj && typeof (obj as any).userlevel === 'number';
  };

  // Helper to get a label for the row for aria-label
  const getRowLabel = (item: SettingType) => {
    if ('name' in item && typeof item.name === 'string') return item.name;
    if ('title' in item && typeof item.title === 'string') return item.title;
    if ('headline' in item && typeof item.headline === 'string') return item.headline;
    if ('username' in item && typeof item.username === 'string') return item.username;
    if ('hash_id' in item && typeof item.hash_id === 'string') return item.hash_id;
    return '';
  };

  return (
    <TableRow
      hover
      sx={{
        background: getBackground(),
        cursor: 'pointer',
        textDecorationLine: status !== 1 ? 'line-through' : 'none',
        height: '55px',
        '&:focus': {
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: '-2px'
        },
        ...sx,
      }}
      role="row"
      aria-selected={selected}
      onKeyDown={(e) => {
        // Allow selecting/deselecting rows with keyboard
        if ((e.key === 'Enter' || e.key === ' ') && !(hasUserlevel(item) && item.userlevel >= 50) && !isFixed()) {
          e.preventDefault();
          toggleRow(String(item.hash_id));
        }
      }}
      tabIndex={0}
      aria-label={`${getRowLabel(item)}${status !== 1 ? ', inactive' : ''}`}
      onClick={() => {
        if (!(hasUserlevel(item) && item.userlevel >= 50) && !isFixed()) {
          toggleRow(String(item.hash_id));
        }
      }}
      {...restOfProps}
    >
      <TableCell sx={{ position: 'sticky', left: 0, zIndex: 2, pl: 1, pr: 0, background: 'inherit' }}>
        {!(hasUserlevel(item) && item.userlevel >= 50) && (
          <Checkbox
            checked={selected}
            onChange={() => {
              if (!isFixed()) toggleRow(String(item.hash_id));
            }}
            slotProps={{
              input: {
                'aria-label': selected ? `Deselect ${getRowLabel(item)}` : `Select ${getRowLabel(item)}`,
              },
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
