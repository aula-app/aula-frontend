import { StatusTypes } from '@/types/Generics';
import { PossibleFields } from '@/types/Scopes';
import { Checkbox, SxProps, TableCell, TableRow, Theme } from '@mui/material';
import { deepOrange, deepPurple, grey, orange } from '@mui/material/colors';
import { ReactNode } from 'react';

/**
 * @component
 * @param {Object} props - Component props
 * @param {Record<keyof PossibleFields, string>} props.item - Data item to be displayed in the row
 * @param {StatusTypes} props.status - Current status of the row that determines its visual style
 *                                    0: Inactive (orange)
 *                                    1: Active (default/no highlight)
 *                                    2: Special status (purple)
 *                                    3: Warning status (light orange)
 * @param {boolean} [props.selected=false] - Whether the row is currently selected
 * @param {(id: number) => void} props.toggleRow - Callback function to handle row selection/deselection
 * @param {ReactNode} props.children - Child elements to be rendered within the row (typically TableCell components)
 * @param {SxProps<Theme>} [props.sx] - Additional styles to apply to the TableRow using MUI's sx prop
 */

type Params = {
  item: Record<keyof PossibleFields, string>;
  status: StatusTypes;
  selected?: boolean;
  toggleRow: (id: number) => void;
  children: ReactNode;
  sx?: SxProps<Theme>;
};

const DataRow = ({ item, selected = false, toggleRow, status, children, sx, ...restOfProps }: Params) => {
  /**
   * Determines the background color based on the row's status and selection state
   * @returns {string} The background color value
   */

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
        {/* disable toggle if room type = 1 */}
        <Checkbox
          checked={selected}
          onChange={() => {
            if (!isFixed()) toggleRow(Number(item.id));
          }}
          disabled={isFixed()}
        />
      </TableCell>
      {children}
    </TableRow>
  );
};

export default DataRow;
