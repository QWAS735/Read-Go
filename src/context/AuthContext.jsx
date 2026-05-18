import { createContext, useContext, useState, useEffect } from "react";
import { getSession, signIn as storageSignIn, signOut as storageSignOut } from "../data/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = getSession();
    if (session) setUser(session);
  }, []);

  async function signIn(username, password) {
    const result = await storageSignIn(username, password);
    if (result.success) setUser({ username: result.user.username });
    return result;
  }

  function signOut() {
    storageSignOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
