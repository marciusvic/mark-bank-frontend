import { useAuthService } from "@/services/auth-service";
import { User } from "@/types/user";
import { createContext, useContext, useEffect, useState } from "react";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}
interface AuthData {
  email: string;
  password: string;
}
interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  signIn: (authData: AuthData) => Promise<void>;
  signUp: (authData: RegisterData) => Promise<void>;
  signOut: () => void;
  setIsAuthenticated: (value: boolean) => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  currentUser: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
  setIsAuthenticated: () => {},
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const token = localStorage.getItem("accessToken");
  const [isAuthenticated, setIsAuthenticated] = useState(
    isTokenValid(token || "")
  );
  const { login, register } = useAuthService();

  function isTokenValid(token: string): boolean {
    try {
      const [, payload] = token.split(".");
      const decodedPayload = JSON.parse(window.atob(payload));
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedPayload.exp && decodedPayload.exp > currentTime;
    } catch (error) {
      console.error("Invalid token:", error);
      return false;
    }
  }

  async function authenticated() {
    const token = localStorage.getItem("accessToken");

    if (token && isTokenValid(token)) {
      const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
      setCurrentUser(user);
      setIsAuthenticated(true);
    } else {
      signOut();
    }
  }

  async function signIn(authData: AuthData) {
    try {
      const response = await login(authData.email, authData.password);
      const { access_token, user } = response.data;
      if (isTokenValid(access_token)) {
        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("currentUser", JSON.stringify(user));

        setCurrentUser(user);
        setIsAuthenticated(true);
      } else {
        throw new Error("Invalid token received");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      setIsAuthenticated(false);
    }
  }

  async function signUp(authData: RegisterData) {
    try {
      const response = await register(
        authData.name,
        authData.email,
        authData.password
      );
      const { access_token, user } = response.data;
      if (isTokenValid(access_token)) {
        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("currentUser", JSON.stringify(user));

        setCurrentUser(user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      setIsAuthenticated(false);
    }
  }
  function signOut() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setIsAuthenticated(false);
  }

  useEffect(() => {
    authenticated();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        signIn,
        signUp,
        signOut,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
