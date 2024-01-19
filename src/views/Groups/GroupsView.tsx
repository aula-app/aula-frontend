import { Typography, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { Stack } from '@mui/system';
import { DataGrid, GridColDef, GridToolbarContainer } from '@mui/x-data-grid';
import { AppAlert, AppButton } from '../../components';
import { CompositionDialog as AddGroupDialog } from '../../components/dialogs'
import { useAppForm, SHARED_CONTROL_PROPS } from '../../utils/form';
import { localStorageGet } from '../../utils/localStorage';
import { useEffect, useState, useCallback } from 'react';

const VALIDATE_FORM_ADD_GROUP = {
  name: {
    presence: true,
  },
};


const GROUP_INITIAL_FORM_VALUES = { 
      name: '', 
      desc_public: '', 
      desc_internal: '', 
      status: 0, 
      internal_info: '',
      access_code: '',
      group_order: 0,
      vote_bias: 1,
      votes_per_user: 1
      } as FormStateValues;

interface FormStateValues {
  name: string;
  desc_public: string;
  desc_internal: string;
  status: number;
  internal_info: string;
  access_code: string;
  group_order: number;
  vote_bias: number;
  votes_per_user: number;
};

/** * Renders "Groups" view
 * url: /groups
 */
const GroupsView = () => {
  const [openAddGroupDialog, setAddGroupDialog] = useState(false);
  const [data, setData] = useState([] as any[]);

   const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: VALIDATE_FORM_ADD_GROUP,
    initialValues: GROUP_INITIAL_FORM_VALUES as FormStateValues,
  });
  const [error, setError] = useState<string>();

  const values = formState.values as FormStateValues; 
  const jwt_token = localStorageGet('token');
  const handleCloseError = useCallback(() => setError(undefined), []);

  function Toolbar() {
    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={() => setAddGroupDialog(true)}>
          Add Group 
        </Button>
      </GridToolbarContainer>
    );
  }

  const columns:GridColDef[] = [
    { field: 'group_name', headerName: 'Name', width: 260},
    { field: 'description_public', headerName: 'Description Public', width: 300},
    { field: 'description_internal', headerName: 'Description Internal', width: 300},
  ] 

  const onAddGroupDialogClose = () => {
    setFormState({values: GROUP_INITIAL_FORM_VALUES, isValid: false, touched: {}, errors: {}})
    setAddGroupDialog(false)
  }

  const submitNewGroup = async () => {
    const data = await (
        await fetch(
          import.meta.env.VITE_APP_API_URL + '/api/controllers/add_group.php',
          {
            method: 'POST', 
            headers: {                   
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + jwt_token
            },
            body: JSON.stringify(
              {'name': values.name,
               'desc_internal': values.desc_internal})
          })).json();

        const result = data.success;

        if (result) {
          onAddGroupDialogClose()
        }
  }

  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      const data = await (
        await fetch(
          "/api/controllers/groups.php"
        )
      ).json();

      // set state when the data received
      if (data.success)
        setData(data.data)
    };

    dataFetch();
    },[]);

  return (
    <Stack direction="column" spacing={2}>
      <Typography variant="h4">Groups</Typography>
      {openAddGroupDialog && <AddGroupDialog
        open
        title="Add Group"
        dialogContent={
          <>
          <TextField
            required
            label="Name"
            name="name"
            value={values.name}
            error={fieldHasError('name')}
            helperText={fieldGetError('name') || ' '}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          <TextField
            label="Public Description"
            name="desc_public"
            multiline
            rows={2}
            value={values.desc_public}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          <TextField
            label="Internal Description"
            name="desc_internal"
            multiline
            rows={2}
            value={values.desc_internal}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
           <TextField
            label="Internal Information"
            name="internal_info"
            multiline
            rows={2}
            value={values.desc_public}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />

          {error ? (
            <AppAlert severity="error" onClose={handleCloseError}>
              {error}
            </AppAlert>
          ) : null}
          </>
        }
        actions={
          <>
            <AppButton onClick={onAddGroupDialogClose}>Cancel</AppButton>
            <AppButton onClick={submitNewGroup} sx={{ mr: 0 }} color="success" >
              Add
            </AppButton>
          </>
        }
 
      />}

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
            toolbar: Toolbar
          }}
        />
      </div>
    </Stack>
  );
};

export default GroupsView;
