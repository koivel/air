import React from 'react';
import { useCookies } from 'react-cookie';
import { environment } from '../../environments/environment';

const initalContext = {
  authenticated: null,
  user: null,
  login: null,
  logout: null,
  register: null,
  accessTokenRef: null,
};

export const KoivelAuthContext = React.createContext(initalContext);

export const KoivelAuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['koivelRefreshToken']);

  const [authenticated, setAuthenticated] = React.useState(false);
  const [refreshToken, setRefreshToken] = React.useState(null);
  const accessToken = React.useRef(null);

  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    setRefreshToken(cookies.koivelRefreshToken);
  }, [cookies.koivelRefreshToken]);

  React.useEffect(() => {
    async function fetchUser() {
      const res = await fetch(
        environment.koivelApiUrl + '/auth-api/user/current',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken.current,
          },
        }
      );
      const json = await res.json();
      if (res.status === 200) {
        setUser(json);
      } else {
        setUser(null);
      }
    }
    if (accessToken.current) {
      fetchUser();
    } else {
      setUser(null);
    }
  }, [authenticated]);

  React.useEffect(() => {
    async function fetchAccessToken() {
      if (refreshToken) {
        const res = await fetch(
          environment.koivelApiUrl + '/auth-api/api-keys/generate/user-access',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + refreshToken,
            },
          }
        );
        const json = await res.json();
        if (res.status === 200) {
          accessToken.current = json.result;
          setAuthenticated(true);
        } else {
          accessToken.current = null;
          setAuthenticated(false);
        }
      } else {
        accessToken.current = null;
        setAuthenticated(false);
      }
    }

    fetchAccessToken();
    const interval = setInterval(() => {
      fetchAccessToken();
    }, 120000);
    return () => clearInterval(interval);
  }, [refreshToken]);

  async function login(email: string, password: string): Promise<string> {
    const res = await fetch(environment.koivelApiUrl + '/auth-api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (res.status === 200) {
      setCookie('koivelRefreshToken', json.result, { path: '/' });
      return null;
    } else {
      return json.message;
    }
  }

  async function register(
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<string> {
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }

    const res = await fetch(
      environment.koivelApiUrl + '/auth-api/user/register',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      }
    );
    const json = await res.json();
    if (res.status === 200) {
      setCookie('koivelRefreshToken', json.result, { path: '/' });
      return null;
    } else {
      return json.message;
    }
  }

  function logout() {
    removeCookie('koivelRefreshToken', { path: '/' });
  }

  const value = {
    authenticated,
    user,
    accessTokenRef: accessToken,
    login,
    logout,
    register,
  };

  return (
    <KoivelAuthContext.Provider value={value}>
      {children}
    </KoivelAuthContext.Provider>
  );
};

export const useKAuth = () => React.useContext(KoivelAuthContext);
