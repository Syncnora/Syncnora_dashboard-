import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { signInWithGoogle as firebaseSignInWithGoogle, firebaseSignOut } from "@/lib/firebase";

export type Role = "admin" | "user";

export interface User {
  id: string;
  email: string;
  name: string;
  avatarInitials: string;
  role: Role;
  createdAt: string;
}

interface StoredUser extends User {
  password: string; // mock only — never do this in real apps
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  updateProfile: (patch: Partial<Pick<User, "name" | "email">>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const USERS_KEY = "syncnora.users";
const SESSION_KEY = "syncnora.session";

const readUsers = (): StoredUser[] => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
};
const writeUsers = (u: StoredUser[]) => localStorage.setItem(USERS_KEY, JSON.stringify(u));

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("") || "U";

const sanitize = (u: StoredUser): User => {
  const { password, ...rest } = u;
  return rest;
};

// Seed admin once
const seed = () => {
  const users = readUsers();
  if (!users.some((u) => u.email === "admin@syncnora.app")) {
    users.push({
      id: "admin-seed",
      email: "admin@syncnora.app",
      password: "admin123",
      name: "Syncnora Admin",
      avatarInitials: "SA",
      role: "admin",
      createdAt: new Date().toISOString(),
    });
    writeUsers(users);
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seed();
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setLoading(false);
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    else localStorage.removeItem(SESSION_KEY);
  };

  const login = async (email: string, password: string) => {
    const users = readUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found || found.password !== password) {
      throw new Error("Invalid email or password");
    }
    persist(sanitize(found));
  };

  const signup = async (name: string, email: string, password: string) => {
    const users = readUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("An account with that email already exists");
    }
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      email,
      password,
      name,
      avatarInitials: initials(name),
      role: "user",
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    writeUsers(users);
    persist(sanitize(newUser));
  };

  const loginWithGoogle = async () => {
    // Real Google sign-in via Firebase
    const profile = await firebaseSignInWithGoogle();
    if (!profile.email) {
      throw new Error("Google account did not return an email");
    }

    const users = readUsers();
    let found = users.find((u) => u.email.toLowerCase() === profile.email.toLowerCase());
    if (!found) {
      found = {
        id: profile.uid,
        email: profile.email,
        password: "", // OAuth account — no local password
        name: profile.name,
        avatarInitials: initials(profile.name),
        role: "user",
        createdAt: new Date().toISOString(),
      };
      users.push(found);
      writeUsers(users);
    }
    persist(sanitize(found));
  };

  const logout = () => {
    firebaseSignOut();
    persist(null);
  };

  const updateProfile = (patch: Partial<Pick<User, "name" | "email">>) => {
    if (!user) return;
    const users = readUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx === -1) return;
    const updated: StoredUser = {
      ...users[idx],
      ...patch,
      avatarInitials: patch.name ? initials(patch.name) : users[idx].avatarInitials,
    };
    users[idx] = updated;
    writeUsers(users);
    persist(sanitize(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, loginWithGoogle, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// Helper for admin page
export const listAllUsers = (): User[] => readUsers().map(sanitize);
export const deleteUserById = (id: string) => {
  const users = readUsers().filter((u) => u.id !== id);
  writeUsers(users);
};
