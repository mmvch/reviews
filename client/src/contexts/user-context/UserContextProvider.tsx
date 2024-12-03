import Cookies from 'js-cookie';
import IdentityUser from '../../models/utils/IdentityUser';
import toast from 'react-hot-toast';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState
} from 'react';

export interface IUserContext {
  user: IdentityUser | null;
  setUser(user: IdentityUser | null): void;
  isAuth: boolean;
  setIsAuth(isAuth: boolean): void;
}

const UserContext = createContext<IUserContext | undefined>(undefined);

const useUserContext = (): IUserContext => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }

  return context;
};

const UserProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const token = Cookies.get("auth");

  const [user, setUser] = useState<IdentityUser | null>(new IdentityUser(token));
  const [isAuth, setIsAuth] = useState<boolean>(!!token);

  useEffect(() => {
    if (!!token) {
      try {
        const identity = new IdentityUser(token);

        setUser(identity);
        setIsAuth(true);
      } catch (error) {
        toast.error('Invalid authorization token');
      }
    }
  }, [token]);

  const UserContextValue: IUserContext = {
    user,
    setUser,
    isAuth,
    setIsAuth
  };

  return <UserContext.Provider value={UserContextValue}>{children}</UserContext.Provider>;
};

export { UserProvider, useUserContext };
