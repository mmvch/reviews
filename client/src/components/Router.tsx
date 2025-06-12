import AdminPage from './Admin/AdminPage';
import App from '../App';
import CreateMovie from './Movie/CreateMovie';
import LoginForm from './Auth/LoginForm';
import MovieContainer from './Movie/MovieContainer';
import MovieView from './Movie/MovieView';
import RegisterForm from './Auth/RegisterForm';
import UpdateMovie from './Movie/UpdateMovie';
import useUser from '../contexts/user-context/useUser';
import { AppRoles } from '../utils/AppRoles';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from 'react-router-dom';

const Router: React.FC = () => {
  const { user, isAuth } = useUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Navigate to="/movies" replace />} />
          <Route path="/movies" element={<MovieContainer />} />

          {isAuth
            ? <Route path="/movies/recommendations" element={<MovieContainer />} />
            : <Route path="/movies/recommendations" element={<Navigate to="/movies" />} />}

          <Route path="/movies/:id" element={<MovieView />} />

          {user?.role === AppRoles.Admin && (
            <>
              <Route path="/movies/create" element={<CreateMovie />} />
              <Route path="/movies/update/:id" element={<UpdateMovie />} />
              <Route path="/admin-page" element={<AdminPage />} />
            </>
          )}

          {!isAuth && (
            <>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
            </>
          )}

          <Route path="*" element={<Navigate to="/movies" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
