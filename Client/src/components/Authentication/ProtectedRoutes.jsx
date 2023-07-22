import { useAuth } from './AuthContext';
import Dashboard from '../Modules/Dashboard';
import { Route, Navigate, Routes} from 'react-router-dom';
import ModuleLayout from '../ModuleLayout';
import Employees from '../Modules/Employees';

function ProtectedRoute({ component: Component, ...rest }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <Routes>
      <Route exact path="/modules" element={<ModuleLayout />} >
        <Route exact path="dashboard" element={<Dashboard />}/>
        <Route exact path="employees" element={<Employees />}/>
      </Route>
    </Routes>
  );
}

export default ProtectedRoute;