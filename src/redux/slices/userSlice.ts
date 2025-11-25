


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

/* =====================================================
   1. FETCH ALL USERS
===================================================== */
export const fetchUsers = createAsyncThunk<User[]>(
  "users/fetchUsers",
  async () => {
    const response = await axiosInstance.get("/users");
    return response.data; // NestJS returns array directly
  }
);

/* =====================================================
   2. CREATE USER
===================================================== */
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
    const response = await axiosInstance.patch(
      `/users/${userData.id}`,
      { name: userData.name, email: userData.email } 
    );
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
  name: "users",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    /* ---------- FETCH USERS ---------- */
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
      });

    /* ---------- CREATE USER ---------- */
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.users.push(action.payload);
        state.loading = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create user";
      });

    /* ---------- UPDATE USER ---------- */
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        const index = state.users.findIndex(
          (u) => u.id === action.payload.id
        );

        if (index !== -1) {
          state.users[index] = action.payload;
        }

        state.loading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update user";
      });

    /* ---------- DELETE USER ---------- */
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete user";
      });
  },
});

export default userSlice;
