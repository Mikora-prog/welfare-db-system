import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/api';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await authService.login(email, password);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            loading: false
          });
          return response;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      register: async (email, password, firstName, lastName, role) => {
        set({ loading: true, error: null });
        try {
          const response = await authService.register(email, password, firstName, lastName, role);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            loading: false
          });
          return response;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false
      }),

      checkAuth: async () => {
        set({ loading: true });
        try {
          const response = await authService.getCurrentUser();
          set({
            user: response,
            isAuthenticated: true,
            loading: false
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            loading: false
          });
        }
      }
    }),
    {
      name: 'auth-store'
    }
  )
);
