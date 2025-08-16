import React, { Suspense } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation
} from "react-router-dom";
import { Loading } from "../components";
import AuthRoutes from "../components/core-module/auth-routes/AuthRoutes";
import { Login } from "../pages";
import NotAuthorized from '../pages/NotAuthorized';
import NotFound from '../pages/NotFound';
import { ROUTES } from "../utility/constant";
import { LastVisitedProvider, useLastVisited } from "../utility/hooks/LastVisitedContext";
import useTitle from "../utility/hooks/useTitle";
import { AuthService } from "../services/authService";

// Import new auth components
import { LoginPage } from "../pages/auth/LoginPage";
import { LoginDemo } from "../pages/auth/LoginDemo";

/**
 * The main router component for the application. This component is responsible
 * for rendering the correct page based on the current route.
 *
 * @returns The router component.
 */
const Router: React.FC = (): JSX.Element => {
  useTitle();

  const LoginRoute = () => {
    const { lastVisited } = useLastVisited();
    const isAuth = AuthService.isAuthenticated();
    
    if (isAuth) {
      return <Navigate to={lastVisited || `${ROUTES.DASHBOARD}`} replace />;
    }
    return <Login />;
  };

  const RouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const validPaths = Object.values(ROUTES) as string[];
    const currentPath = location.pathname;
    const isAuth = AuthService.isAuthenticated();

    if (currentPath === '/') {
      if (isAuth) {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
      }
      return <Navigate to={ROUTES.LOGIN} replace />;
    }
    if (
      currentPath !== ROUTES.NOTAUTHORIZED &&
      currentPath !== ROUTES.NOTFOUND &&
      !validPaths.includes(currentPath) && isAuth
    ) {
      return <Navigate to={ROUTES.NOTFOUND} replace />;
    } else if (currentPath !== ROUTES.NOTAUTHORIZED &&
      currentPath !== ROUTES.NOTFOUND &&
      !validPaths.includes(currentPath) && !isAuth) {
      return <Navigate to={ROUTES.LOGIN} replace />;
    }
    return <>{children}</>;
  };

  return (
    <>
      <LastVisitedProvider>
        <Suspense fallback={<Loading />}>
          <RouteGuard>
            <Routes>
              {/* 🔒 Protected Routes */}
              <Route element={<AuthRoutes />}>
                {/* Not Authorized Route */}
                <Route path={ROUTES.NOTAUTHORIZED} element={<NotAuthorized />} />
                <Route path={ROUTES.NOTFOUND} element={<NotFound />} />
                
                {/* 🔓 Public Routes */}
                <Route path={ROUTES.LOGIN} element={<LoginRoute />} />
                
                {/* New Auth Components */}
                <Route path={ROUTES.LOGIN_NEW} element={<LoginPage />} />
                <Route path={ROUTES.LOGIN_DEMO} element={<LoginDemo />} />
                
                {/* Fallback for any unknown route */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </RouteGuard>
        </Suspense>
      </LastVisitedProvider>
    </>
  )
};

export default Router;
