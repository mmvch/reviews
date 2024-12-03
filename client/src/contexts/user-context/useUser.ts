import Cookies from 'js-cookie';
import IdentityUser from '../../models/utils/IdentityUser';
import toast from 'react-hot-toast';
import { EventType, LoginService } from '../../services/LoginService';
import { useCallback, useEffect } from 'react';
import { useUserContext } from './UserContextProvider';

const useUser = () => {
  const { user, setUser, isAuth, setIsAuth } = useUserContext();

  const setAuth = useCallback(() => {
    const token = Cookies.get("auth");

    if (!!token) {
      try {
        const identity = new IdentityUser(token);

        setUser(identity);
        setIsAuth(true);
      } catch (error) {
        toast.error("Invalid authorization token");
      }
    }
  }, [setUser, setIsAuth]);

  const removeAuth = useCallback(() => {
    setUser(null);
    setIsAuth(false);
  }, [setUser, setIsAuth]);

  useEffect(() => {
    LoginService.addEventListener(EventType.Logout, removeAuth);
    LoginService.addEventListener(EventType.Login, setAuth);
    return () => {
      LoginService.removeEventListener(EventType.Logout, removeAuth);
      LoginService.removeEventListener(EventType.Login, setAuth);
    };
  }, [removeAuth, setAuth]);

  return {
    user,
    isAuth,
    setAuth,
    removeAuth,
  };
};

export default useUser;
