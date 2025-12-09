// @/redux/slices/uiSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  sidebarPosition: "left" | "right";
  showFooter: boolean;
}

const initialState: UiState = {
  sidebarPosition: "left",
  showFooter: true,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebarPosition: (state) => {
      console.log("Redux: Before toggle sidebar:", state.sidebarPosition);
      state.sidebarPosition = state.sidebarPosition === "left" ? "right" : "left";
      console.log("Redux: After toggle sidebar:", state.sidebarPosition);
    },
    toggleFooter: (state) => {
      console.log("Redux: Before toggle footer:", state.showFooter);
      state.showFooter = !state.showFooter;
      console.log("Redux: After toggle footer:", state.showFooter);
    },
    setSidebarPosition: (state, action: PayloadAction<"left" | "right">) => {
      state.sidebarPosition = action.payload;
    },
    setShowFooter: (state, action: PayloadAction<boolean>) => {
      state.showFooter = action.payload;
    },
  },
});

export const { 
  toggleSidebarPosition, 
  toggleFooter, 
  setSidebarPosition, 
  setShowFooter 
} = uiSlice.actions;

export default uiSlice.reducer;