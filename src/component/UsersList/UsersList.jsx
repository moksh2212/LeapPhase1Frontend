import React, { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  TextField,
  Checkbox,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TablePagination,
  TableSortLabel,
  Chip,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import FilterListIcon from '@mui/icons-material/FilterList'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import { useSelector } from 'react-redux'
import EditUserModal from './UpdateUser'

const UserTable = () => {
  const [users, setUsers] = useState([])
  const [selected, setSelected] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [openSnackbar, setOpenSnackbar] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [orderBy, setOrderBy] = useState('inctureId')
  const [order, setOrder] = useState('asc')
  const [filterAnchorEl, setFilterAnchorEl] = useState(null)
  const [filters, setFilters] = useState({})
  const [roleFilter, setRoleFilter] = useState('')
  const [uniqueRoles, setUniqueRoles] = useState([])

  const token = useSelector(state => state.user.token)
  const baseUrl = process.env.BASE_URL

  console.log(selected)

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    setUniqueRoles(getUniqueRoles(users))
  }, [users])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${baseUrl}/super/security/getAllUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        throw new Error('Failed to fetch users')
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      setSelected(users)
      return
    }
    setSelected([])
  }

  const handleClick = user => {
    const selectedIndex = selected.findIndex(
      selectedUser => selectedUser.id === user.id,
    )
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, user)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }

    setSelected(newSelected)
  }

  const isSelected = id => selected.some(user => user.id === id)

  const handleSearchChange = event => {
    setSearchQuery(event.target.value)
  }

  const handleDeleteClick = () => {
    setOpenDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    setIsLoading(true)
    console.log(selected)
    try {
      const response = await fetch(`${baseUrl}/super/security/deleteUsers`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-type' : 'application/json'
        },
        body: JSON.stringify(selected)
      })
      if (response.ok) {
        const updatedUsers = users.filter(user => !selected.some(selectedUser => selectedUser.id === user.id))
        setUsers(updatedUsers)
        setOpenSnackbar('User(s) deleted successfully')
        setSelected([])
      }

    } catch (error) {
      setError('Failed to delete users')
    } finally {
      setIsLoading(false)
      setOpenDeleteModal(false)
    }
  }
  const handleEditClick = () => {
    if (selected.length === 1) {
      setEditingUser(selected[0])
      setOpenEditModal(true)
    }
  }

  const handleEditConfirm = async updatedUser => {
    const formdata = new FormData()
    let newRoles = updatedUser.roles.join(', ')
    formdata.append('id', updatedUser.id)
    formdata.append('newRoles', newRoles)

    setIsLoading(true)
    setSelected([])
    try {
      const response = await fetch(`${baseUrl}/super/security/changeRole`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: formdata,
      })

      if (response.ok) {
        const updatedUsers = users.map(user =>
          user.id === updatedUser.id ? updatedUser : user,
        )
        setUsers(updatedUsers)
        setOpenSnackbar('User updated successfully')
      }
    } catch (error) {
      setError('Failed to update user')
    } finally {
      setIsLoading(false)
      setOpenEditModal(false)
      setEditingUser(null)
    }
  }

  const handleRoleFilterChange = event => {
    setRoleFilter(event.target.value)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleRequestSort = property => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleFilterClose = () => {
    setFilterAnchorEl(null)
  }

  const getUniqueRoles = users => {
    const allRoles = users.flatMap(user => user.roles)
    return [...new Set(allRoles)]
  }

  const handleFilterApply = newFilters => {
    setFilters(newFilters)
    handleFilterClose()
  }

  const filteredUsers = users
    .filter(user =>
      Object.values(user).some(
        value =>
          value &&
          value.toString().toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    )
    .filter(user => {
      if (!roleFilter) return true
      return user.roles.includes(roleFilter)
    })

  const sortedUsers = filteredUsers.sort((a, b) => {
    const isAsc = order === 'asc'
    if (a[orderBy] < b[orderBy]) return isAsc ? -1 : 1
    if (a[orderBy] > b[orderBy]) return isAsc ? 1 : -1
    return 0
  })

  const paginatedUsers = sortedUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  )

  return (
    <Box>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={2}
      >
        <Box display='flex' alignItems='center'>
          <Button
            startIcon={<EditIcon />}
            onClick={handleEditClick}
            disabled={selected.length !== 1}
            sx={{ mr: 1, textTransform: 'none', borderRadius: '4px' }}
            variant='contained'
            color='primary'
          >
            Edit
          </Button>
          <TextField
            placeholder='Search'
            value={searchQuery}
            onChange={handleSearchChange}
            variant='outlined'
            size='small'
            InputProps={{
              startAdornment: <SearchIcon color='action' />,
            }}
            sx={{ boxShadow: 2 }}
          />
          <FormControl
            variant='outlined'
            size='small'
            sx={{ ml: 1, minWidth: 120 }}
          >
            <InputLabel>Filter Role</InputLabel>
            <Select
              value={roleFilter}
              onChange={handleRoleFilterChange}
              label='Filter Role'
            >
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              {uniqueRoles.map(role => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Button
          startIcon={<DeleteIcon />}
          onClick={handleDeleteClick}
          disabled={selected.length === 0}
          sx={{ textTransform: 'none', borderRadius: '4px' }}
          variant='contained'
          color='error'
        >
          Delete
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding='checkbox'>
                <Checkbox
                  indeterminate={
                    selected.length > 0 && selected.length < users.length
                  }
                  checked={users.length > 0 && selected.length === users.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              {['inctureId', 'email', 'talentName', 'roles'].map(column => (
                <TableCell key={column}>
                  <TableSortLabel
                    active={orderBy === column}
                    direction={orderBy === column ? order : 'asc'}
                    onClick={() => handleRequestSort(column)}
                  >
                    {column.charAt(0).toUpperCase() + column.slice(1)}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map(user => {
              const isItemSelected = isSelected(user.id)

              return (
                <TableRow
                  hover
                  onClick={() => handleClick(user)}
                  role='checkbox'
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={user.id}
                  selected={isItemSelected}
                >
                  <TableCell padding='checkbox'>
                    <Checkbox checked={isItemSelected} />
                  </TableCell>
                  <TableCell>{user.inctureId}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.talentName}</TableCell>
                  <TableCell>{user.roles.join(', ')}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component='div'
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the selected users?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color='error'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <EditUserModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        user={editingUser}
        onSave={handleEditConfirm}
      />

      <Dialog
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
        anchorEl={filterAnchorEl}
      >
        <DialogTitle>Filter Users</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin='normal'
            label='Incture ID'
            value={filters.inctureId || ''}
            onChange={e =>
              setFilters({ ...filters, inctureId: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin='normal'
            label='Email'
            value={filters.email || ''}
            onChange={e => setFilters({ ...filters, email: e.target.value })}
          />
          <TextField
            fullWidth
            margin='normal'
            label='Name'
            value={filters.talentName || ''}
            onChange={e =>
              setFilters({ ...filters, talentName: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFilterClose}>Cancel</Button>
          <Button onClick={() => handleFilterApply(filters)} color='primary'>
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(openSnackbar)}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(null)}
          severity='success'
          variant='filled'
        >
          {openSnackbar}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity='error' variant='filled'>
          {error}
        </Alert>
      </Snackbar>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  )
}

export default UserTable
