import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth-context";
import { ChildrenProps } from "@/types/types";
import { User } from "@/types/user";
import { useUserService } from "@/services/user-service";

interface UserContextType {
  allUsers: User[];
}

export const UserContext = createContext<UserContextType>({
  allUsers: [],
});

export default function UserProvider({ children }: ChildrenProps) {
  const [allUsers, setUsers] = useState<User[]>([]);
  const { getUsers } = useUserService();
  const { isAuthenticated } = useAuth();

  async function fetchUsers() {
    try {
      const response = await getUsers();
      const { data } = response;
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }
  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated]);

  return (
    <UserContext.Provider
      value={{
        allUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
