import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  TRegisterData,
  TLoginData,
  registerUserApi,
  loginUserApi,
  logoutApi,
  getUserApi,
  updateUserApi
} from '@api';
import { setCookie, deleteCookie } from '../../utils/cookie';

type TUserState = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  user: TUser | null;
  loginUserError: string | null;
  loginUserRequest: boolean;
};

const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  user: null,
  loginUserError: null,
  loginUserRequest: false
};

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const getUser = createAsyncThunk('user/getUser', async () => {
  const response = await getUserApi();
  return response.user;
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user: Partial<TRegisterData>) => {
    const response = await updateUserApi(user);
    return response.user;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = action.error.message || 'Ошибка регистрации';
        state.isAuthChecked = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = action.error.message || 'Ошибка входа';
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      .addCase(getUser.pending, (state) => {
        state.loginUserRequest = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.loginUserRequest = false;
        state.isAuthChecked = true;
        state.isAuthenticated = false;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});

export const { authChecked } = userSlice.actions;
export const userReducer = userSlice.reducer;
