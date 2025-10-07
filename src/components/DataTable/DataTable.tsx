import { PossibleFields, SettingType } from '@/types/Scopes';
import { SettingNamesType } from '@/types/SettingsTypes';
import { getDataLimit, localStorageGet, localStorageSet } from '@/utils';
import { Stack } from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import PaginationBar from './PaginationBar';
import Table from './Table';
import ToolBar from './ToolBar';

const MANUAL_LIMIT_KEY = 'dataTableManualLimit';

type Props = {
  scope: SettingNamesType;
  columns: Array<{ name: keyof PossibleFields; orderId: number }>;
  rows: SettingType[];
  totalItems?: number;
  orderAsc: boolean;
  orderBy: number;
  limit?: number;
  offset?: number;
  isLoading?: boolean;
  extraTools?: ({ items }: { items: Array<string> }) => JSX.Element;
  onReload?: () => void;
  setAsc: Dispatch<SetStateAction<boolean>>;
  setLimit: Dispatch<SetStateAction<number>>;
  setOffset?: Dispatch<SetStateAction<number>>;
  setOrderby: Dispatch<SetStateAction<number>>;
  setEdit: (item: SettingType | boolean) => void;
  setDelete: (items: Array<string>) => void;
};

/**
 * DataTable component - Layout orchestrator for Table, ToolBar, and PaginationBar
 * Manages selection state and coordinates between child components
 */
const DataTable: React.FC<Props> = ({
  scope,
  columns,
  rows,
  totalItems,
  orderAsc,
  orderBy,
  limit,
  offset,
  isLoading,
  extraTools,
  onReload,
  setAsc,
  setLimit,
  setOffset,
  setOrderby,
  setDelete,
  setEdit,
}) => {
  const [selected, setSelected] = useState<Array<string>>([]);
  const isManualLimit = useRef(false);

  const toggleRow = (id: string) => {
    selected.includes(id) ? setSelected(selected.filter((value) => value !== id)) : setSelected([...selected, id]);
  };

  const toggleAllRows = () => {
    selected.length > 0
      ? setSelected([])
      : setSelected(rows.filter((row) => !('userlevel' in row && row.userlevel >= 50)).map((row) => row.hash_id));
  };

  const getLimit = () => {
    const storedLimit = localStorageGet(MANUAL_LIMIT_KEY);
    if (storedLimit && typeof storedLimit === 'number') {
      isManualLimit.current = true;
      setLimit(storedLimit);
    } else {
      setLimit(getDataLimit());
    }
  };

  const handleLimitChange = (newLimit: number) => {
    isManualLimit.current = true;
    localStorageSet(MANUAL_LIMIT_KEY, newLimit);
    setLimit(newLimit);
  };

  const handleDelete = () => {
    setDelete(selected);
    setSelected([]);
  };

  const handleEdit = (value: boolean) => {
    setEdit(value);
    setSelected([]);
  };

  useEffect(() => {
    // Initialize limit from localStorage if available
    getLimit();

    window.addEventListener('resize', getLimit);
    return () => {
      window.removeEventListener('resize', getLimit);
    };
  }, []);

  // Calculate pages only if pagination props are provided
  const showPagination = totalItems !== undefined && limit !== undefined && setOffset !== undefined;
  const pages = showPagination ? Math.ceil(totalItems / limit) : 0;

  return (
    <Stack flex={1} sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <ToolBar scope={scope} selected={selected} setEdit={handleEdit} setDelete={handleDelete} extraTools={extraTools} />
      <Table
        scope={scope}
        columns={columns}
        rows={rows}
        selected={selected}
        orderAsc={orderAsc}
        orderBy={orderBy}
        setAsc={setAsc}
        setOrderby={setOrderby}
        setEdit={setEdit}
        toggleRow={toggleRow}
        toggleAllRows={toggleAllRows}
        isLoading={isLoading}
        onReload={onReload}
      />
      {showPagination && (
        <PaginationBar
          pages={pages}
          setPage={(page) => setOffset(page * limit)}
          limit={limit}
          setLimit={handleLimitChange}
        />
      )}
    </Stack>
  );
};

export default DataTable;
