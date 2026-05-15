import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;
export const useAuth = create(
  persist(
    (set) => ({
      currentUser: null,
      loading: false,
      isAuthenticated: false,
      error: null,

      login: async (userCred) => {
        try {
          // set loading true
          set({ loading: true, error: null });

          // make api call
          let res = await axios.post(
            `${BASE_URL}/common-api/login`,
            userCred,
            { withCredentials: true }
          );

          console.log("res is", res);

          // update state
          set({
            loading: false,
            isAuthenticated: true,
            currentUser: res.data.payload,
          });

        } catch (err) {
          console.log("err is", err);

          set({
            loading: false,
            isAuthenticated: false,
            currentUser: null,
            error: err.response?.data?.error || "Login failed",
          });
        }
      },

      checkAuth: async () => {
        try {
          set({ loading: true });
          const res = await axios.get(`${BASE_URL}/common-api/me`, { withCredentials: true });
          set({
            loading: false,
            isAuthenticated: true,
            currentUser: res.data.payload,
          });
        } catch (err) {
          console.error("Check auth failed:", err);
          set({
            loading: false,
            isAuthenticated: false,
            currentUser: null,
          });
        }
      },

      logout: async () => {
        try {
          // set loading true
          set({ loading: true, error: null });

          // make api call
          await axios.get(
            `${BASE_URL}/common-api/logout`, { withCredentials: true }
          );

          // clear state
          set({
            loading: false,
            isAuthenticated: false,
            currentUser: null,
            error: null,
          });

        } catch (err) {
          set({
            loading: false,
            isAuthenticated: false,
            currentUser: null,
            error: err.response?.data?.error || "Logout failed",
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage", // key for localStorage
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }), // only persist these
    }
  )
);