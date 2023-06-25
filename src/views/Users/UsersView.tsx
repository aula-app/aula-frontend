import { Typography, TextField, InputAdornment } from '@mui/material';
import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Stack } from '@mui/system';
import { DataGrid, GridColDef, GridRowParams, GridActionsCellItem, GridValueGetterParams, GridToolbarContainer } from '@mui/x-data-grid';
import { AppLink, AppIconButton, AppAlert, AppButton } from '../../components';
import { CompositionDialog as AddUserDialog } from '../../components/dialogs'
import { CompositionDialog as DeleteUserDialog } from '../../components/dialogs'
import { useAppForm, SHARED_CONTROL_PROPS, eventPreventDefault } from '../../utils/form';
import { localStorageGet } from '../../utils/localStorage';
import { useEffect, useState, useCallback } from 'react';
import * as React from 'react';

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
  email: {
    presence: true,
  },
};

const USER_INITIAL_VALUES = {
  username: '',
  password: '',
  email: '',
  realname: '',
  displayname: '',
  position: '',
  about_me: '',
  userlevel: 0,
  infinite_votes: 0
} as FormStateValues;

interface FormStateValues {
  username: string;
  password: string;
  email: string;
  realname: string;
  displayname: string;
  position: string;
  about_me: string;
  userlevel: number;
  infinite_votes: number;
};


/** * Renders "Users" view
 * url: /
 */
const UsersView = () => {
  const [openAddUserDialog, setAddUserDialog] = useState(false);
  const [openDeleteUserDialog, setDeleteUserDialog] = useState(false);
  const [newUserData, setNewUserData] = useState(USER_INITIAL_VALUES);

  const [selectedUser, setSelectedUser] = useState(-1)
  const [data, setData] = useState([] as any[]);

  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: VALIDATE_FORM_ADD_USER,
    initialValues: USER_INITIAL_VALUES as FormStateValues,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>();

  const values = formState.values as FormStateValues;
  const jwt_token = localStorageGet('token');
  const handleShowPasswordClick = useCallback(() => {
    setShowPassword((oldValue) => !oldValue);
  }, []);

  const handleCloseError = useCallback(() => setError(undefined), []);

  function Toolbar() {
    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={() => setAddUserDialog(true)}>
          Add User
        </Button>
      </GridToolbarContainer>
    );
  }

  const selectedUserObj = () => {
    const userIdx = data.findIndex(user => user.id === selectedUser)
    return data[userIdx]
  }

  const deleteUserDialog = React.useCallback(
    (row: GridRowParams) => async () => {
      setSelectedUser(row.row.id)
      setDeleteUserDialog(true)
    },
    [],
  );

  const deleteUser =  React.useCallback(async () => {
    const deletedUser = selectedUser
    await requestDeleteUser(selectedUser)
    const newData = data.filter(user => user.id !== deletedUser)
    setData(newData)
    setSelectedUser(-1)
    setDeleteUserDialog(false)
  }, [selectedUser])

  const requestDeleteUser = async function (userId:number) {
    const data = await (
        await fetch(
          '/api/controllers/delete_user.php',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + jwt_token
            },
            body: JSON.stringify(
              {'user_id': userId,
               })
          })).json();

        const result = data.success;

        if (result) {
          setDeleteUserDialog(false)
        }
  }

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 50,
    page: 0,
  });

  const columns:GridColDef[] = [
    { field: 'actions',
      type: 'actions',
      getActions: (params: GridRowParams) => [
      <GridActionsCellItem icon={<EditIcon/>} onClick={()=>{console.log('edit')}} label="Edit" />,
      <GridActionsCellItem icon={<DeleteIcon/>} onClick={deleteUserDialog(params)} label="Delete" />,
      ]
    },
    { field: 'realname', headerName: 'Real Name', width: 260},
    { field: 'username', headerName: 'Username', width: 300},
    { field: 'displayname', headerName: 'Displayname', width: 300},
    { field: 'email', headerName: 'email', width: 300},
    { field: 'about_me', headerName: 'About me', width: 300},
  ]

  const onAddUserDialogClose = () => {
    formContext.reset()
    setAddUserDialog(false)
  }

  const onDeleteUserDialogClose = () => {
    setDeleteUserDialog(false)
    setSelectedUser(-1)
  }

  const formContext = useForm<FormStateValues>({
    defaultValues: USER_INITIAL_VALUES
  });

  const submitNewUser = async () => {
    const values = formContext.getValues();
    const requestResult = await requestAddNewUser(values);
    formContext.reset();
    onAddUserDialogClose()
    console.log(data[data.length - 1]);
  }

  const requestAddNewUser = async (formValues:FormStateValues) => {
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
              {'username': formValues.username,
               'password': formValues.password,
               'realname': formValues.realname,
               'displayname': formValues.displayname,
               'email': formValues.email
               })
          })).json();

        return data;
  }

  const changePage = async (page:any) => {
    setPaginationModel(page)
    // fetch data
    // const dataFetch = async () => {
    //   const data = await (
    //     await fetch(
    //       "/api/controllers/users.php",
    //       {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //           'Authorization': 'Bearer ' + jwt_token
    //         },
    //         body: JSON.stringify(
    //           {'limit': 50,
    //            'offset': 0,
    //            })
    //         }
    //     )
    //   ).json();

    //   // set state when the data received
    //   if (data.success)
    //     setData(data.data)
    // };
  }

  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      const data = await (
        await fetch(
          "/api/controllers/users.php",
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + jwt_token
            },
            body: JSON.stringify(
              {'limit': 0,
               'offset': 0,
               })
            }
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
      {openDeleteUserDialog && <DeleteUserDialog
        open
        title="Delete User"
        content={
          <>
          Do you really want to delete the user <b>{ selectedUserObj()['displayname']}</b>?

          {error ? (
            <AppAlert severity="error" onClose={handleCloseError}>
              {error}
            </AppAlert>
          ) : null}
          </>
        }
        actions={
          <>
            <AppButton onClick={onDeleteUserDialogClose}>Cancel</AppButton>
            <AppButton onClick={deleteUser} sx={{ mr: 0 }} color="warning" >
              Delete
            </AppButton>
          </>
        }

      />}


      {openAddUserDialog && <AddUserDialog
        open
        title="Add User"
        content={
          <>
          <FormContainer formContext={formContext} >
          <TextFieldElement
            required
            label="Username"
            name="username"
            value={values.username}
            error={fieldHasError('username')}
            helperText={fieldGetError('username') || ' '}
            {...SHARED_CONTROL_PROPS}
          />
          <TextFieldElement
            required
            label="Real name"
            name="realname"
            value={values.realname}
            error={fieldHasError('realname')}
            helperText={fieldGetError('realname') || ' '}
            {...SHARED_CONTROL_PROPS}
          />
          <TextFieldElement
            required
            label="Display name"
            name="displayname"
            value={values.displayname}
            error={fieldHasError('displayname')}
            helperText={fieldGetError('displayname') || ' '}
            {...SHARED_CONTROL_PROPS}
          />
          <TextFieldElement
            required
            label="email"
            name="email"
            value={values.email}
            error={fieldHasError('email')}
            helperText={fieldGetError('email') || ' '}
            {...SHARED_CONTROL_PROPS}
          />

          <TextFieldElement
            required
            type={showPassword ? 'text' : 'password'}
            label="Password"
            name="password"
            value={values.password}
            error={fieldHasError('password')}
            helperText={fieldGetError('password') || ' '}
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
          </FormContainer>
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
          paginationModel={paginationModel}
          onPaginationModelChange={changePage}
          rows={data}
          columns={columns}
          pageSizeOptions={[10, 50, 100, 200]}
          checkboxSelection
          slots={{
            toolbar: Toolbar
          }}
        />
      </div>
    </Stack>
  );
};

export default UsersView;
