import { createContext, useContext, ReactNode } from 'react';

export type AdminTheme = 'light' | 'dark';

const AdminThemeContext = createContext<AdminTheme>('light');

export function AdminThemeProvider({ children, theme = 'light' }: { children: ReactNode; theme?: AdminTheme }) {
  return (
    <AdminThemeContext.Provider value={theme}>
      {children}
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  return useContext(AdminThemeContext);
}
