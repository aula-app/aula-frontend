import { Typography, TextField, InputAdornment } from '@mui/material';
import { FormContainer, TextFieldElement, SelectElement, useForm } from 'react-hook-form-mui';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Stack } from '@mui/system';
import { DataGrid, GridSortModel, GridColDef, GridRowParams, GridActionsCellItem, GridValueGetterParams, GridToolbarContainer } from '@mui/x-data-grid';
import { AppLink, AppIconButton, AppAlert, AppButton } from '../../components';
import { CompositionDialog as AddUserDialog } from '../../components/dialogs'
import { CompositionDialog as DeleteUserDialog } from '../../components/dialogs'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { SelectChangeEvent } from '@mui/material/Select';
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
  id: -1,
  user_id: -1,
  username: '',
  password: '',
  email: '',
  realname: '',
  displayname: '',
  about_me: '',
  position: 0,
  status: 0,
  userlevel: '10',
  infinite_votes: 0
} as FormStateValues;

interface FormStateValues {
  id: number;
  user_id: number;
  username: string;
  password: string;
  email: string;
  realname: string;
  displayname: string;
  about_me: string;
  userlevel: string;
  position: number;
  status: number;
  infinite_votes: number;
};


/** * Renders "Users" view
 * url: /
 */
const UsersView = () => {
  const [openAddUserDialog, setAddUserDialog] = useState(false);
  const [openDeleteUserDialog, setDeleteUserDialog] = useState(false);
  const [newUserData, setNewUserData] = useState(USER_INITIAL_VALUES);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState(-1)
  const [selectedEditUser, setSelectedEditUser] = useState(-1)

  const [data, setData] = useState([] as any[]);
  const [numRows, setNumRows] = useState(0);

  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    {
      field: 'last_update',
      sort: 'desc',
    },
  ]); 

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

  const editUserDialog = React.useCallback(
    (row: GridRowParams) => async () => {
      setSelectedEditUser(row.row.id)
      setAddUserDialog(true)
      const editUser = row.row
      formContext.setValue('id',editUser.id)
      formContext.setValue('user_id',editUser.id)
      formContext.setValue('username',editUser.username)
      formContext.setValue('displayname',editUser.displayname)
      formContext.setValue('realname',editUser.realname)
      formContext.setValue('email',editUser.email)
      formContext.setValue('about_me',editUser.about_me)
      formContext.setValue('position',editUser.position)
      formContext.setValue('status',editUser.status)
      formContext.setValue('userlevel',(editUser.userlevel)?editUser.userlevel:10)
    },
    [],
  );


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
      <GridActionsCellItem icon={<EditIcon/>} onClick={editUserDialog(params)} label="Edit" />,
      <GridActionsCellItem icon={<DeleteIcon/>} onClick={deleteUserDialog(params)} label="Delete" />,
      ]
    },
    { field: 'last_update', headerName: 'Updated at', width: 260},
    { field: 'realname', headerName: 'Real Name', width: 260},
    { field: 'username', headerName: 'Username', width: 300},
    { field: 'displayname', headerName: 'Displayname', width: 300, sortable: false},
    { field: 'email', headerName: 'email', width: 300, sortable: false},
    { field: 'about_me', headerName: 'About me', width: 300, sortable: false},
  ]

  const onAddUserDialogClose = () => {
    formContext.reset()
    setSelectedEditUser(-1)
    setAddUserDialog(false)
  }

  const onDeleteUserDialogClose = () => {
    setDeleteUserDialog(false)
    setSelectedUser(-1)
  }

  const formContext = useForm<FormStateValues>({
    defaultValues: USER_INITIAL_VALUES
  });

  const submitUserForm = async () => {
    if (selectedEditUser !== -1) {
      await submitEditUser();
    } else {
      await submitNewUser();
    }
  }

  const submitEditUser = async () => {
    const values = formContext.getValues();
    const requestResult = await requestEditUser(values);
    if(requestResult['success'])  {
      const userIdx = data.findIndex(user => user.id === values.user_id)
      const newData = Object.assign([], data, {[userIdx]: values})
      setData(newData)
    }
    formContext.reset();
    onAddUserDialogClose()
  }

  const submitNewUser = async () => {
    const values = formContext.getValues();
    const requestResult = await requestAddNewUser(values);
    formContext.reset();
    onAddUserDialogClose()
  }

  const requestEditUser = async (formValues:FormStateValues) => {
    const data = await (
        await fetch(
          '/api/controllers/update_user.php',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + jwt_token
            },
            body: JSON.stringify(
              {'user_id': formValues.user_id,
               'username': formValues.username,
               'realname': formValues.realname,
               'displayname': formValues.displayname,
               'email': formValues.email,
               'about_me': formValues.about_me,
               'userlevel': formValues.userlevel,
               'position': formValues.position,
               'status': formValues.status
               })
          })).json();

        return data;
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
               'email': formValues.email,
               'userlevel': formValues.userlevel,
               'about_me': formValues.about_me,
               'position': formValues.position,
               })
          })).json();

        return data;
  }

  const changePage = async (page:any) => {
    setPaginationModel(page)
  }

  const changeSort = async (sort:any) => {
    if (sort.length > 0) {
      setSortModel(sort)
    } else {
      setSortModel([{ field: 'last_update', sort: 'desc' }])
    }
  }

  useEffect(() => {
    // fetch data
    setIsLoading(true)
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
              {'limit': paginationModel.pageSize,
               'offset': paginationModel.page*paginationModel.pageSize,
               'field': sortModel[0].field,
               'order': sortModel[0].sort
               })
            }
        )
      ).json();

      // set state when the data received
      if (data.success) {
        setData(data.data)
        setNumRows(data.count)
        setIsLoading(false)
      }
    };

    dataFetch();
    },[paginationModel, sortModel]);

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
        title={(selectedEditUser !== -1)? "Edit User":"Add User"}
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
          <InputLabel id="userlevel">User Role</InputLabel>
          <SelectElement
            name="userlevel"
            value={values.userlevel}
            id="userlevel"
            label="User Role"
            options={[
              {
              id: 10,
              label: 'Guest'
              },
              {
              id: 20,
              label: 'Standard'
              },
              {
              id: 30,
              label: 'Moderator'
              },
              {
              id: 40,
              label: 'Super Moderator'
              },
              {
              id: 50,
              label: 'Admin'
              },
              {
              id: 60,
              label: 'Tech Admin'
              },

            ]}
          >
            <MenuItem value={10}>Guest</MenuItem>
            <MenuItem value={"20"}>Standard</MenuItem>
            <MenuItem value={30}>Moderator</MenuItem>
            <MenuItem value={40}>Super Moderator</MenuItem>
            <MenuItem value={50}>Admin</MenuItem>
            <MenuItem value={60}>Tech Admin</MenuItem>
          </SelectElement>
          { (selectedEditUser == -1)?
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
          />:''}
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
            <AppButton onClick={submitUserForm} sx={{ mr: 0 }} color="success" >
            {(selectedEditUser !== -1)?'Save':'Add'}
            </AppButton>
          </>
        }

      />}

      <div style={{ width: '100%' }}>
        <DataGrid
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={changePage}
          onSortModelChange={changeSort}
          rows={data}
          rowCount={numRows}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[10, 50, 100]}
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
