
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '../../../utility/constant';
import { AuthService } from '../../../services/authService';

function AuthRoutes() {
  const location = useLocation();
  
  // Only handle the specific case of redirecting authenticated users from root to dashboard
  if (location.pathname === "/") {
    const templateValue = AuthService.getTemplateValue();
    return <Navigate to={`${ROUTES.DASHBOARD}?theme=${templateValue}`} replace />;
  }

  return <Outlet />;
}

export default AuthRoutes;