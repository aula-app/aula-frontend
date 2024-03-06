import { Typography, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { Stack } from '@mui/system';
import { DataGrid, GridColDef, GridToolbarContainer } from '@mui/x-data-grid';
import { AppButton } from '@/components';
import { CompositionDialog as AddGroupDialog } from '@/components/dialogs';
import { useEffect, useState } from 'react';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { databaseRequest } from '@/utils/requests';

const schema = yup
  .object({
    name: yup.string().required(),
    desc_public: yup.string(),
    desc_internal: yup.string(),
    status: yup.number(),
    internal_info: yup.string(),
    access_code: yup.string(),
    group_order: yup.number(),
    vote_bias: yup.number(),
    votes_per_user: yup.number()
  })
  .required();

/** * Renders "Groups" view
 * url: /groups
 */
const GroupsView = () => {
  const [openAddGroupDialog, setAddGroupDialog] = useState(false);
  const [data, setData] = useState([] as any[]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  function Toolbar() {
    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={() => setAddGroupDialog(true)}>
          Add Group
        </Button>
      </GridToolbarContainer>
    );
  }

  const columns: GridColDef[] = [
    { field: 'group_name', headerName: 'Name', width: 260 },
    { field: 'description_public', headerName: 'Description Public', width: 300 },
    { field: 'description_internal', headerName: 'Description Internal', width: 300 },
  ];

  const onAddGroupDialogClose = () => {
    setAddGroupDialog(false);
  };

  const onSubmit = async (formData: Object) => {
    const request = await databaseRequest('add_idea', {...formData})

    if(!request) {
      return;
    }

    onAddGroupDialogClose();
  }
  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      const data = await (await fetch('/api/controllers/groups.php')).json();

      // set state when the data received
      if (data.success) setData(data.data);
    };

    dataFetch();
  }, []);

  return (
    <Stack direction="column" spacing={2}>
      <Typography variant="h4">Groups</Typography>
      {openAddGroupDialog && (
        <AddGroupDialog
          open
          title="Add Group"
          dialogContent={
            <FormContainer>
              <TextField
                required
                label="Name"
                {...register('name')}
                error={errors.name ? true : false}
                helperText={errors.name?.message || ' '}
              />
              <TextField
                label="Public Description"
                {...register('desc_public')}
                error={errors.desc_public ? true : false}
                helperText={errors.desc_public?.message || ' '}
                multiline
                rows={2}
              />
              <TextField
                label="Internal Description"
                {...register('desc_internal')}
                error={errors.desc_internal ? true : false}
                helperText={errors.desc_internal?.message || ' '}
                multiline
                rows={2}
              />
              <TextField
                label="Internal Information"
                {...register('internal_info')}
                error={errors.internal_info ? true : false}
                helperText={errors.internal_info?.message || ' '}
                multiline
                rows={2}
              />
            </FormContainer>
          }
          actions={
            <>
              <AppButton onClick={onAddGroupDialogClose}>Cancel</AppButton>
              <AppButton onClick={handleSubmit(onSubmit)} sx={{ mr: 0 }} color="success">
                Add
              </AppButton>
            </>
          }
        />
      )}

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
          slots={{
            toolbar: Toolbar,
          }}
        />
      </div>
    </Stack>
  );
};

export default GroupsView;
