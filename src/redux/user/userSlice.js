import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
  signoutMessage: null,
  token:null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: state => {
      state.loading = true
      state.error = null
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload.user
      state.loading = false
      state.error = null
      state.token = action.payload.token
    },
    signInFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    updateStart: state => {
      state.loading = true
      state.error = null
    },
    updateFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    updateSuccess: (state, action) => {
      state.loading = false
      state.error = null
      state.currentUser = action.payload
    },

    signoutSuccess: (state, action) => {
      state.currentUser = null
      state.loading = false
      state.error = null
      state.signoutMessage = action.payload
    },
    setErrorNull: state => {
      state.error = null
    },
    setSessionExpired: (state, action) => {
      state.sessionExpired = action.payload;
    },
  },
})

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateStart,
  updateFailure,
  updateSuccess,

  signoutSuccess,

  setErrorNull,
  setSessionExpired,
} = userSlice.actions

export default userSlice.reducer
