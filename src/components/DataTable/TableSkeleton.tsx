import React from 'react';
import { Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5, columns = 4 }) => {
  const { t } = useTranslation();

  return (
    <TableContainer
      component={Paper}
      role="status"
      aria-label={t('ui.accessibility.loading', { var: t('ui.accessibility.tableData') })}
    >
      <Table aria-busy="true">
        <TableHead>
          <TableRow>
            {Array.from({ length: columns }).map((_, index) => (
              <TableCell key={index}>
                <Skeleton
                  variant="text"
                  width="80%"
                  height={24}
                  aria-label={t('ui.accessibility.loading', { var: t('ui.accessibility.columnHeader') })}
                />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton
                    variant="text"
                    width="60%"
                    height={20}
                    aria-label={t('ui.accessibility.loading', { var: t('ui.accessibility.tableCell') })}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableSkeleton;
