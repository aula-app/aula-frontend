import { Typography } from '@mui/material';
import { FormContainer, TextFieldElement, SelectElement, useForm } from 'react-hook-form-mui';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Stack } from '@mui/system';
import { DataGrid, GridSortModel, GridColDef, GridRowParams, GridActionsCellItem, GridToolbarContainer } from '@mui/x-data-grid';
import { AppAlert, AppButton } from '../../components';
import { CompositionDialog as AddUserDialog } from '../../components/dialogs'
import { CompositionDialog as DeleteUserDialog } from '../../components/dialogs'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { useAppForm, SHARED_CONTROL_PROPS } from '../../utils/form';
import { localStorageGet } from '../../utils/localStorage';
import { useEffect, useState, useCallback } from 'react';
import * as React from 'react';
import { da } from 'date-fns/locale';

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

const MESSAGE_INITIAL_VALUES = {
  id: -1,
  headline: '',
  body: '',
  consent_text: '',
  user_needs_to_consent: 2
} as FormStateValues;

interface FormStateValues {
  id: number;
  headline: string;
  body: string;
  consent_text: string;
  user_needs_to_consent: number;
};


/** * Renders "Texts" view
 * url: /texts
 */
const TextsView = () => {
  const [openAddUserDialog, setAddUserDialog] = useState(false);
  const [openDeleteUserDialog, setDeleteUserDialog] = useState(false);
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
    initialValues: MESSAGE_INITIAL_VALUES as FormStateValues,
  });
  const [error, setError] = useState<string>();

  const values = formState.values as FormStateValues;
  const jwt_token = localStorageGet('token');

  const handleCloseError = useCallback(() => setError(undefined), []);

  const formContext = useForm<FormStateValues>({
    defaultValues: MESSAGE_INITIAL_VALUES
  });

  function Toolbar() {
    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={() => setAddUserDialog(true)}>
          Add Text
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

    console.log("<<<<",(editUser.user_needs_to_consent)?editUser.user_needs_to_consent:2)
      formContext.setValue('id',editUser.id)
      formContext.setValue('headline',editUser.headline)
      formContext.setValue('body',editUser.body)
      formContext.setValue('consent_text',editUser.consent_text)
      formContext.setValue('user_needs_to_consent',editUser.user_needs_to_consent)
    },
    [formContext],
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
  }, [data, selectedUser])

  const requestDeleteUser = async function (userId:number) {
    const data = await (
        await fetch(
          '/api/controllers/delete_text.php',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + jwt_token
            },
            body: JSON.stringify(
              {'text_id': userId,
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
    { field: 'headline', headerName: 'Headline', width: 260},
    { field: 'body', headerName: 'Text Body', width: 300},
    { field: 'user_needs_to_consent', headerName: 'Consent type', width: 300, sortable: false},
    { field: 'consent_text', headerName: 'Consent text', width: 300, sortable: false},
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
      const userIdx = data.findIndex(user => user.id === values.id)
      const newData = Object.assign([], data, {[userIdx]: values})
      setData(newData)
    }
    formContext.reset();
    onAddUserDialogClose()
  }

  const submitNewUser = async () => {
    const values = formContext.getValues();
    const requestResult = await requestAddNewUser(values);
    values.id = requestResult.text_id;
    const newData = data.concat([values]);
    setData(newData)
    formContext.reset();
    onAddUserDialogClose();
  }

  const requestEditUser = async (formValues:FormStateValues) => {
    const data = await (
        await fetch(
          '/api/controllers/update_text.php',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + jwt_token
            },
            body: JSON.stringify(
              {'text_id': formValues.id,
               'headline': formValues.headline,
               'body': formValues.body,
               'consent_text': formValues.consent_text,
               'user_needs_to_consent': formValues.user_needs_to_consent,
               })
          })).json();

        return data;
  }

  const requestAddNewUser = async (formValues:FormStateValues) => {
    const data = await (
        await fetch(
          '/api/controllers/add_text.php',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + jwt_token
            },
            body: JSON.stringify(
              {'headline': formValues.headline,
               'body': formValues.body,
               'consent_text': formValues.consent_text,
               'user_needs_to_consent': formValues.user_needs_to_consent,
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
          "/api/controllers/texts.php",
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
    },[paginationModel, sortModel, jwt_token]);

  return (
    <Stack direction="column" spacing={2}>
      <Typography variant="h4">Texts</Typography>
      {openDeleteUserDialog && <DeleteUserDialog
        open
        title="Delete Text"
        dialogContent={
          <>
          Do you really want to delete the text <b>{ selectedUserObj()['headline']}</b>?

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
        title={(selectedEditUser !== -1)? "Edit Message":"Add Message"}
        dialogContent={
          <>
          <FormContainer formContext={formContext} >
          <TextFieldElement
            required
            label="Headline"
            name="headline"
            value={values.headline}
            error={fieldHasError('headline')}
            helperText={fieldGetError('headline') || ' '}
            {...SHARED_CONTROL_PROPS}
          />
          <TextFieldElement
            required
            label="Text body"
            name="body"
            value={values.body}
            error={fieldHasError('body')}
            helperText={fieldGetError('body') || ' '}
            {...SHARED_CONTROL_PROPS}
          />
          <TextFieldElement
            required
            label="Consent Text"
            name="consent_text"
            value={values.consent_text}
            error={fieldHasError('consent_text')}
            helperText={fieldGetError('consent_text') || ' '}
            {...SHARED_CONTROL_PROPS}
          />
          <InputLabel id="user_needs_to_consent">User needs to consent?</InputLabel>
          <SelectElement
            name="user_needs_to_consent"
            value={values.user_needs_to_consent}
            id="user_needs_to_consent"
            label="User needs to consent"
            options={[
              {
              id: 0,
              label: 'No'
              },
              {
              id: 1,
              label: 'Yes but not necessary'
              },
              {
              id: 2,
              label: 'Yes and necessary'
              },

            ]}
          >
            <MenuItem value={0}>No</MenuItem>
            <MenuItem value={1}>Yes but not mandatory</MenuItem>
            <MenuItem value={2}>Yes and mandatory</MenuItem>
          </SelectElement>
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

export default TextsView;
