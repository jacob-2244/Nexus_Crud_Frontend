// src/redux/slices/permissionSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchAllGroups,
  createGroup,
  deleteGroup,
  fetchAllPermissions,
  fetchGroupPermissions,
  setGroupPermissions,
} from "@/lib/permissionApi";
import { UserRole } from "@/types/User";
import type {
  RoleGroup,
  AllPermissionsView,
  GroupPermissionsDetail,
} from "@/types/Permission";

interface PermissionState {
  groups: RoleGroup[];
  allPermissions: AllPermissionsView | null;
  activeGroupDetail: GroupPermissionsDetail | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: PermissionState = {
  groups: [],
  allPermissions: null,
  activeGroupDetail: null,
  loading: false,
  saving: false,
  error: null,
  successMessage: null,
};

// ─── Thunks ──────────────────────────────────────────────────────────────────

export const loadGroups = createAsyncThunk("permissions/loadGroups", async () =>
  fetchAllGroups(),
);

export const addGroup = createAsyncThunk(
  "permissions/addGroup",
  async (payload: { name: string; roles: UserRole[] }) =>
    createGroup(payload.name, payload.roles),
);

export const removeGroup = createAsyncThunk(
  "permissions/removeGroup",
  async (id: number) => {
    await deleteGroup(id);
    return id;
  },
);

export const loadAllPermissions = createAsyncThunk(
  "permissions/loadAll",
  async () => fetchAllPermissions(),
);

export const loadGroupPermissions = createAsyncThunk(
  "permissions/loadGroupPermissions",
  async (groupId: number) => fetchGroupPermissions(groupId),
);

export const saveGroupPermissions = createAsyncThunk(
  "permissions/save",
  async (payload: { groupId: number; menuItemIds: number[] }) => {
    await setGroupPermissions(payload.groupId, payload.menuItemIds);
    return payload;
  },
);

// ─── Slice ───────────────────────────────────────────────────────────────────

const permissionSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    clearMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // loadGroups
    builder.addCase(loadGroups.pending, (state) => { state.loading = true; });
    builder.addCase(loadGroups.fulfilled, (state, action: PayloadAction<RoleGroup[]>) => {
      state.groups = action.payload;
      state.loading = false;
    });
    builder.addCase(loadGroups.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to load groups";
    });

    // addGroup
    builder.addCase(addGroup.pending, (state) => { state.saving = true; });
    builder.addCase(addGroup.fulfilled, (state, action: PayloadAction<RoleGroup>) => {
      state.groups.push(action.payload);
      state.saving = false;
      state.successMessage = `Group "${action.payload.name}" created successfully!`;
    });
    builder.addCase(addGroup.rejected, (state, action) => {
      state.saving = false;
      state.error = action.error.message || "Failed to create group";
    });

    // removeGroup
    builder.addCase(removeGroup.fulfilled, (state, action: PayloadAction<number>) => {
      state.groups = state.groups.filter((g) => g.id !== action.payload);
      state.successMessage = "Group deleted";
    });

    // loadAllPermissions
    builder.addCase(loadAllPermissions.pending, (state) => { state.loading = true; });
    builder.addCase(loadAllPermissions.fulfilled, (state, action: PayloadAction<AllPermissionsView>) => {
      state.allPermissions = action.payload;
      state.loading = false;
    });
    builder.addCase(loadAllPermissions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to load permissions";
    });

    // loadGroupPermissions
    builder.addCase(loadGroupPermissions.pending, (state) => { state.loading = true; state.activeGroupDetail = null; });
    builder.addCase(loadGroupPermissions.fulfilled, (state, action: PayloadAction<GroupPermissionsDetail>) => {
      state.activeGroupDetail = action.payload;
      state.loading = false;
    });
    builder.addCase(loadGroupPermissions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to load group permissions";
    });

    // saveGroupPermissions
    builder.addCase(saveGroupPermissions.pending, (state) => { state.saving = true; });
    builder.addCase(saveGroupPermissions.fulfilled, (state) => {
      state.saving = false;
      state.successMessage = "Permissions saved successfully!";
    });
    builder.addCase(saveGroupPermissions.rejected, (state, action) => {
      state.saving = false;
      state.error = action.error.message || "Failed to save permissions";
    });
  },
});

export const { clearMessages } = permissionSlice.actions;
export default permissionSlice;