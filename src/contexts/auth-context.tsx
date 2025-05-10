

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";

// Mock data for demo purposes
const mockUsers = [
  {
    id: "admin1",
    username: "admin",
    name: "Admin User",
    email: "admin@hostel.com",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=admin"
  },
  {
    id: "staff1",
    username: "staff",
    name: "Staff Member",
    email: "staff@hostel.com",
    role: "staff",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=staff"
  },
  {
    id: "student1",
    username: "student",
    name: "John Student",
    email: "student@hostel.com",
    role: "student",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=student"
  }
] as User[];

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("hostel-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string, role: string): Promise<boolean> => {
    // In a real app, this would be an API call to validate credentials
    try {
      // Simple mock authentication for demo
      if (password !== "password") {
        throw new Error("Invalid credentials");
      }

      const foundUser = mockUsers.find(
        (u) => u.username === username && u.role === role
      );

      if (!foundUser) {
        throw new Error("User not found");
      }

      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem("hostel-user", JSON.stringify(foundUser));
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("hostel-user");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
