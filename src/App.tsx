import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { CustomThemeProvider } from "./contexts/ThemeContext";
import PrivateRoute from "./components/PrivateRoute";
import AppLayout from "./components/layout/AppLayout";
import {
  publicRoutes,
  privateRoutes,
  DEFAULT_PUBLIC_PATH,
  DEFAULT_PRIVATE_PATH,
} from "./routes";



const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {publicRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            isAuthenticated() ? (
              <Navigate to={DEFAULT_PRIVATE_PATH} replace />
            ) : (
              React.createElement(route.component)
            )
          }
        />
      ))}

      {privateRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <PrivateRoute>
              <AppLayout>
                <route.component />
              </AppLayout>
            </PrivateRoute>
          }
        />
      ))}

      <Route
        path="*"
        element={
          <Navigate
            to={isAuthenticated() ? DEFAULT_PRIVATE_PATH : DEFAULT_PUBLIC_PATH}
            replace
          />
        }
      />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <CustomThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </CustomThemeProvider>
    </BrowserRouter>
  );
};

export default App;
