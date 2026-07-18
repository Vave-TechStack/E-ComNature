import { describe, it, expect, beforeEach } from 'vitest';
import reducer, {
  toggleTheme,
  setTheme,
  toggleMobileMenu,
  setMobileMenuOpen,
  toggleSearch,
  setLoading,
  openModal,
  closeModal,
} from '@/store/slices/uiSlice';

describe('uiSlice', () => {
  it('should return the initial state', () => {
    const state = reducer(undefined, { type: 'unknown' });
    expect(state.theme).toBe('light');
    expect(state.isMobileMenuOpen).toBe(false);
    expect(state.isSearchOpen).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.activeModal).toBeNull();
  });

  describe('theme', () => {
    it('should toggle theme between light and dark', () => {
      const toggled = reducer(undefined, toggleTheme());
      expect(toggled.theme).toBe('dark');

      const toggledAgain = reducer(toggled, toggleTheme());
      expect(toggledAgain.theme).toBe('light');
    });

    it('should set theme explicitly', () => {
      const dark = reducer(undefined, setTheme('dark'));
      expect(dark.theme).toBe('dark');

      const light = reducer(dark, setTheme('light'));
      expect(light.theme).toBe('light');
    });
  });

  describe('mobile menu', () => {
    it('should toggle mobile menu', () => {
      const toggled = reducer(undefined, toggleMobileMenu());
      expect(toggled.isMobileMenuOpen).toBe(true);

      const toggledAgain = reducer(toggled, toggleMobileMenu());
      expect(toggledAgain.isMobileMenuOpen).toBe(false);
    });

    it('should set mobile menu state explicitly', () => {
      const opened = reducer(undefined, setMobileMenuOpen(true));
      expect(opened.isMobileMenuOpen).toBe(true);

      const closed = reducer(opened, setMobileMenuOpen(false));
      expect(closed.isMobileMenuOpen).toBe(false);
    });
  });

  describe('search', () => {
    it('should toggle search open state', () => {
      const toggled = reducer(undefined, toggleSearch());
      expect(toggled.isSearchOpen).toBe(true);

      const toggledAgain = reducer(toggled, toggleSearch());
      expect(toggledAgain.isSearchOpen).toBe(false);
    });
  });

  describe('loading', () => {
    it('should set loading state', () => {
      const loading = reducer(undefined, setLoading(true));
      expect(loading.isLoading).toBe(true);

      const notLoading = reducer(loading, setLoading(false));
      expect(notLoading.isLoading).toBe(false);
    });
  });

  describe('modal', () => {
    it('should open a modal by name', () => {
      const state = reducer(undefined, openModal('confirm-delete'));
      expect(state.activeModal).toBe('confirm-delete');
    });

    it('should close the modal', () => {
      const opened = reducer(undefined, openModal('confirm-delete'));
      const closed = reducer(opened, closeModal());
      expect(closed.activeModal).toBeNull();
    });
  });
});
