import { Typography, TextField, InputAdornment } from '@mui/material';
import { Stack } from '@mui/system';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { AppLink, AppIconButton, AppAlert, AppButton } from '../../components';
import { CompositionDialog as AddUserDialog } from '../../components/dialogs'
import { useAppForm, SHARED_CONTROL_PROPS, eventPreventDefault } from '../../utils/form';
import { localStorageGet } from '../../utils/localStorage';
import { useEffect, useState, useCallback } from 'react';


const VALIDATE_FORM_ADD_USER = {
  username: {
    presence: true,
  },
  password: {
    presence: true,
    length: {
      minimum: 4,
      maximum: 32,
      message: 'must be between 4 and 32 characters',
    },
  },
};

interface FormStateValues {
  username: string;
  password: string;
}

/** * Renders "Welcome" view
 * url: /
 */
const UsersView = () => {
  const [openAddUserDialog, setAddUserDialog] = useState(false);
  const [data, setData] = useState([] as any[]);

   const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: VALIDATE_FORM_ADD_USER,
    initialValues: { username: '', password: '' } as FormStateValues,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>();

  const values = formState.values as FormStateValues; 
  const jwt_token = localStorageGet('token');
  const handleShowPasswordClick = useCallback(() => {
    setShowPassword((oldValue) => !oldValue);
  }, []);

  const handleCloseError = useCallback(() => setError(undefined), []);

  const columns:GridColDef[] = [
    { field: 'realname', headerName: 'Real Name', width: 260},
    { field: 'username', headerName: 'username', width: 300},
  ] 

  const onAddUserDialogClose = () => {
    setFormState({values: { username: '', password: ''}, isValid: false, touched: {}, errors: {}})
    setAddUserDialog(false)
  }

  const submitNewUser = async () => {
    const data = await (
        await fetch(
          '/api/controllers/add_user.php',
          {
            method: 'POST', 
            headers: {                   
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + jwt_token
            },
            body: JSON.stringify(
              {'username': values.username,
               'password': values.password})
          })).json();

        const result = data.success;

        if (result) {
          onAddUserDialogClose()
        }
  }

  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      const data = await (
        await fetch(
          "/api/controllers/users.php"
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
      <Typography variant="h4">Users</Typography>
      <AppButton onClick={() => setAddUserDialog(true)}>Add User</AppButton>
      {openAddUserDialog && <AddUserDialog
        open
        title="Add User"
        content={
          <>
          <TextField
            required
            label="Username"
            name="username"
            value={values.username}
            error={fieldHasError('username')}
            helperText={fieldGetError('username') || ' '}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          <TextField
            required
            type={showPassword ? 'text' : 'password'}
            label="Password"
            name="password"
            value={values.password}
            error={fieldHasError('password')}
            helperText={fieldGetError('password') || ' '}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <AppIconButton
                    aria-label="toggle password visibility"
                    icon={showPassword ? 'visibilityon' : 'visibilityoff'}
                    title={showPassword ? 'Hide Password' : 'Show Password'}
                    onClick={handleShowPasswordClick}
                    onMouseDown={eventPreventDefault}
                  />
                </InputAdornment>
              ),
            }}
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
            <AppButton onClick={onAddUserDialogClose}>Cancel</AppButton>
            <AppButton onClick={submitNewUser} sx={{ mr: 0 }} color="success" >
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
        />
      </div>
    </Stack>
  );
};

export default UsersView;
