import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      currentUser: null,
      role: null,

      login: (userData) => {
        set({
          isAuthenticated: true,
          currentUser: userData,
          role: userData.role,
          name: userData.name,
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          currentUser: null,
          role: null,
        });
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);

export default useAuthStore;
