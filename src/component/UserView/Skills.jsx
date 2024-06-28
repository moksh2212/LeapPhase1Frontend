import { useEffect, useMemo, useState } from 'react';
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  IconButton,
  Snackbar,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const baseUrl = "http://192.168.137.38:8080"; // Update the base URL as needed

const UserSkills = () => {
  const [userSkillsList, setUserSkillsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [error, setError] = useState();
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(null);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState(null);
  const [openDeleteRowsModal, setOpenDeleteRowsModal] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    if (error) {
      setError(null);
    }
    setOpenSnackbar(false);
  };

  const handleDelete = async () => {
    await deleteUser(userIdToDelete);
    setOpenDeleteModal(false);
  };

  const renderDeleteModal = () => (
    <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
      <DialogTitle>Delete User</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete this user?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
        <Button onClick={handleDelete} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderDeleteRowsModal = () => (
    <Dialog open={openDeleteRowsModal} onClose={() => setOpenDeleteRowsModal(false)}>
      <DialogTitle>Delete Users</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete selected users?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDeleteRowsModal(false)}>Cancel</Button>
        <Button onClick={handleDeleteSelectedRows} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${baseUrl}/api/users/getAll`);
        const data = await response.json();
        setUserSkillsList(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const createUser = async newUser => {
    setIsLoading(true);
    setError(null);
    setOpenSnackbar(null);

    try {
      newUser.primarySkills = newUser.primarySkills.split(',').map(skill => skill.trim());
      newUser.secondarySkills = newUser.secondarySkills.split(',').map(skill => skill.trim());
      const formData = new FormData();
      for (const key in newUser) {
        formData.append(key, newUser[key]);
      }
      const response = await fetch(`${baseUrl}/api/users/create`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        setError(null);
        const data = await response.json();
        setValidationErrors({});
        setUserSkillsList(prevUsers => [...prevUsers, data]);
        setOpenSnackbar('User added successfully!');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async userToUpdate => {
    setIsLoading(true);
    setError(null);
    setOpenSnackbar(null);
    try {
      if (typeof userToUpdate.primarySkills === 'string') {
        userToUpdate.primarySkills = userToUpdate.primarySkills.split(',').map(skill => skill.trim());
      }
      if (typeof userToUpdate.secondarySkills === 'string') {
        userToUpdate.secondarySkills = userToUpdate.secondarySkills.split(',').map(skill => skill.trim());
      }
      const formData = new FormData();
      for (const key in userToUpdate) {
        formData.append(key, userToUpdate[key]);
      }
      const response = await fetch(`${baseUrl}/api/users/update/${userToUpdate.id}`, {
        method: 'PUT',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setValidationErrors({});
        setUserSkillsList(prevUsers =>
          prevUsers.map(user => (user.id === data.id ? data : user)),
        );
        setOpenSnackbar('User updated successfully!');
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setError(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async userId => {
    setIsLoading(true);
    setError(null);
    setOpenSnackbar(null);
    try {
      const response = await fetch(`${baseUrl}/api/users/delete/${userId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setUserSkillsList(prevUsers =>
          prevUsers.filter(user => user.id !== userId),
        );
        setOpenSnackbar('User deleted successfully!');
        setError(null);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSelectedRows = async () => {
    setOpenSnackbar(null);
    setError(null);
    setIsLoading(true);
    setOpenDeleteRowsModal(false);

    let count = 0;
    try {
      for (const row of selectedRows) {
        await deleteUser(row.id);
        count++;
      }
    } catch (error) {
      setError(`Failed to delete user(s): ${error.message}`);
    }

    setRowSelection([]);
    setOpenSnackbar(`${count} User(s) deleted successfully.`);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        enableEditing: false,
        size: 150,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        enableEditing: true,
        enableSorting: false,
        size: 150,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.name,
          helperText: validationErrors?.name,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              name: undefined,
            }),
          onBlur: event => {
            const { value } = event.target;
            if (!value) {
              setValidationErrors(prevErrors => ({
                ...prevErrors,
                name: 'Name cannot be empty',
              }));
            }
          },
        },
      },
      {
        accessorKey: 'knowledgeIn',
        header: 'Knowledge In',
        enableSorting: false,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.experience,
          helperText: validationErrors?.experience,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              experience: undefined,
            }),
          onBlur: event => {
            const { value } = event.target;
            if (!value) {
              setValidationErrors(prevErrors => ({
                ...prevErrors,
                experience: 'Experience cannot be empty',
              }));
            }
          },
        },
      },
      {
        accessorKey: 'primarySkills',
        header: 'Primary Skills',
        enableSorting: false,
        Cell: ({ cell }) => cell.getValue().join(', '),
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.primarySkills,
          helperText: validationErrors?.primarySkills,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              primarySkills: undefined,
            }),
          onBlur: event => {
            const { value } = event.target;
            if (!value) {
              setValidationErrors(prevErrors => ({
                ...prevErrors,
                primarySkills: 'Primary Skills cannot be empty',
              }));
            }
          },
        },
      },
      {
        accessorKey: 'secondarySkills',
        header: 'Secondary Skills',
        enableSorting: false,
        Cell: ({ cell }) => cell.getValue().join(', '),
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.secondarySkills,
          helperText: validationErrors?.secondarySkills,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              secondarySkills: undefined,
            }),
          onBlur: event => {
            const { value } = event.target;
            if (!value) {
              setValidationErrors(prevErrors => ({
                ...prevErrors,
                secondarySkills: 'Secondary Skills cannot be empty',
              }));
            }
          },
        },
      },
      {
        accessorKey: 'cv',
        header: 'CV',
        enableSorting: false,
        Cell: ({ cell }) => {
          const fileName = cell.getValue().split('/').pop();
          return (
            <Button
              variant="contained"
              component="a"
              href={`${baseUrl}/api/cv/${fileName}`}
              target="_blank"
              download
            >
              Download
            </Button>
          );
        },
        muiEditTextFieldProps: {
          type: 'file',
          inputProps: { accept: '.pdf, .doc, .docx' },
        },
      },
    ],
    [validationErrors],
  );

  const {
    getRowModel,
    getSelectedRowModel,
    getState,
    
    setColumnFilters,
    setGlobalFilter,
    setSorting,
    resetSorting,
  } = useMaterialReactTable({
    columns,
    data: userSkillsList,
    getRowId: row => row.id,
    enableRowSelection: true,
    enableEditing: true,
    enableColumnOrdering: false,
    enableColumnResizing: false,
    enableColumnFilterModes: true,
    state: {
      rowSelection,
    },
    onEditingRowSave: async ({ exitEditingMode, row, values }) => {
      const formData = new FormData();
      for (const key in values) {
        formData.append(key, values[key]);
      }
      if (formData.get('cv') instanceof File) {
        const file = formData.get('cv');
        if (file.size > 2 * 1024 * 1024) {
          setValidationErrors({
            ...validationErrors,
            cv: 'CV size must be less than 2 MB',
          });
          return;
        }
      }
      await updateUser(values);
      exitEditingMode();
    },
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip arrow placement="left" title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="right" title="Delete">
          <IconButton
            color="error"
            onClick={() => {
              setUserIdToDelete(row.original.id);
              setOpenDeleteModal(true);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Button
          color="error"
          onClick={() => setOpenDeleteRowsModal(true)}
          variant="contained"
          disabled={!table.getIsSomeRowsSelected()}
        >
          Delete Selected
        </Button>
      </Box>
    ),
  });

  useEffect(() => {
    setSelectedRows(getSelectedRowModel().rows.map(row => row.original));
  }, [getSelectedRowModel]);

  return (
    <Box>
      <MaterialReactTable
        {...{
          columns,
          data: userSkillsList,
          getRowId: row => row.id,
          enableRowSelection: true,
          enableEditing: true,
          enableColumnOrdering: false,
          enableColumnResizing: true,
          enableColumnFilterModes: false,
        }}
      />
      {renderDeleteModal()}
      {renderDeleteRowsModal()}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={error ? 'error' : 'success'}>
          {error ? error : openSnackbar}
        </Alert>
      </Snackbar>
      {isLoading && <CircularProgress />}
    </Box>
  );
};

export default UserSkills;
