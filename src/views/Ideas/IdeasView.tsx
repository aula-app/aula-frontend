import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { AppLink } from '../../components';
import { useEffect, useState } from 'react';


/** * Renders "Welcome" view
 * url: /
 */
const IdeasView = () => {
  const [data, setData] = useState([] as any[]);
  const columns:GridColDef[] = [
    { field: 'content',
      headerName: 'Content',
      width: 600,
      renderCell: (params) => <AppLink to={'/idea/' +params.row.id}>{params.row.content}</AppLink>
    },
    { field: 'sum_votes', headerName: 'Votes', width: 260},
    { field: 'sum_likes', headerName: 'Like', width: 260},
  ]

  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      const data = await (
        await fetch(
          import.meta.env.VITE_APP_API_URL + "/api/controllers/ideas.php"
        )
      ).json();

      // set state when the data received
      setData(data.data)
    };

    dataFetch();
    },[]);

  return (
    <Stack direction="column" spacing={2}>
      <Typography variant="h4">Ideas</Typography>

      <div style={{ width: '100%' }}>
        <DataGrid
          rows={data}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 20]}
          checkboxSelection
        />
      </div>
    </Stack>
  );
};

export default IdeasView;
