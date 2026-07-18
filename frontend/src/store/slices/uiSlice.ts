import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Theme = 'light' | 'dark';

interface UIState {
  theme: Theme;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  isLoading: boolean;
  activeModal: string | null;
}

const initialState: UIState = {
  theme: 'light',
  isMobileMenuOpen: false,
  isSearchOpen: false,
  isLoading: false,
  activeModal: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileMenuOpen = action.payload;
    },
    toggleSearch: (state) => {
      state.isSearchOpen = !state.isSearchOpen;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.activeModal = action.payload;
    },
    closeModal: (state) => {
      state.activeModal = null;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleMobileMenu,
  setMobileMenuOpen,
  toggleSearch,
  setLoading,
  openModal,
  closeModal,
} = uiSlice.actions;

export default uiSlice.reducer;
