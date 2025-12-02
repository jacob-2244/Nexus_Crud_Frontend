



import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { axiosInstance } from "@/lib/axiosInstance";
import { User, UserCreateInput, UserUpdateInput } from "@/types/User";

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};


export const fetchUsers = createAsyncThunk<User[]>(
  "users/fetchUsers",
  async () => {
    const response = await axiosInstance.get("/users");
    return response.data;
  }
);


export const createUser = createAsyncThunk<User, UserCreateInput>(
  "users/createUser",
  async (userData) => {
    const response = await axiosInstance.post("/users", userData);
    return response.data;
  }
);


export const updateUser = createAsyncThunk<User, UserUpdateInput>(
  "users/updateUser",
  async (userData) => {
    const response = await axiosInstance.patch(`/users/${userData.id}`, {
      name: userData.name,
      email: userData.email,
    });
    return response.data;
  }
);


export const deleteUser = createAsyncThunk<number, number>(
  "users/deleteUser",
  async (userId) => {
    await axiosInstance.delete(`/users/${userId}`);
    return userId;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.users[index] = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      });
  },
});

export default userSlice;
