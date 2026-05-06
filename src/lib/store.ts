// Frontend-only persistent store using localStorage, scoped per user.
import { useEffect, useState } from "react";

export interface Task {
  id: string;
  title: string;
  time: string;
  priority: "high" | "medium" | "low";
  done: boolean;
  category: string;
  createdAt: string;
}

export interface Routine {
  id: string;
  label: string;
  icon: string; // lucide icon name
  progress: number; // 0-100
  streak: number;
}

export interface Reminder {
  id: string;
  title: string;
  at: string; // human-readable time
  date: string; // ISO date
  urgent: boolean;
  type: "meeting" | "personal" | "errand";
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  due: string; // ISO date
  status: "paid" | "pending" | "overdue";
  category: string;
}

export interface UserSettings {
  notifications: boolean;
  emailDigest: boolean;
  weekStartsMonday: boolean;
  language: string;
}

const KEY = (uid: string, ns: string) => `syncnora.${uid}.${ns}`;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function useUserStore<T>(uid: string | undefined, namespace: string, initial: T) {
  const key = uid ? KEY(uid, namespace) : "";
  const [value, setValue] = useState<T>(() => (uid ? read<T>(key, initial) : initial));

  useEffect(() => {
    if (!uid) return;
    setValue(read<T>(key, initial));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, namespace]);

  useEffect(() => {
    if (!uid) return;
    write(key, value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return [value, setValue] as const;
}

// Defaults
export const defaultTasks: Task[] = [
  { id: "1", title: "Review quarterly product roadmap", time: "9:00 AM", priority: "high", done: true, category: "Work", createdAt: new Date().toISOString() },
  { id: "2", title: "Design review with team — Syncnora v2", time: "11:30 AM", priority: "high", done: false, category: "Design", createdAt: new Date().toISOString() },
  { id: "3", title: "Morning yoga & meditation", time: "7:00 AM", priority: "medium", done: true, category: "Wellness", createdAt: new Date().toISOString() },
  { id: "4", title: "Reply to client feedback emails", time: "2:00 PM", priority: "medium", done: false, category: "Work", createdAt: new Date().toISOString() },
  { id: "5", title: "Grocery shopping for the week", time: "6:00 PM", priority: "low", done: false, category: "Personal", createdAt: new Date().toISOString() },
];

export const defaultRoutines: Routine[] = [
  { id: "r1", label: "Morning Ritual", icon: "Coffee", progress: 100, streak: 12 },
  { id: "r2", label: "Workout", icon: "Dumbbell", progress: 75, streak: 7 },
  { id: "r3", label: "Reading", icon: "BookOpen", progress: 40, streak: 4 },
  { id: "r4", label: "Wind Down", icon: "Moon", progress: 0, streak: 2 },
];

export const defaultReminders: Reminder[] = [
  { id: "rm1", title: "Team standup meeting", at: "10:30 AM", date: new Date().toISOString().slice(0,10), urgent: true, type: "meeting" },
  { id: "rm2", title: "Doctor appointment", at: "2:00 PM", date: new Date(Date.now()+86400000).toISOString().slice(0,10), urgent: false, type: "personal" },
  { id: "rm3", title: "Pickup dry cleaning", at: "5:30 PM", date: new Date().toISOString().slice(0,10), urgent: false, type: "errand" },
];

export const defaultBills: Bill[] = [
  { id: "b1", name: "Rent", amount: 1200, due: "2026-04-28", status: "pending", category: "Housing" },
  { id: "b2", name: "Electricity", amount: 84.5, due: "2026-04-30", status: "pending", category: "Utilities" },
  { id: "b3", name: "Internet", amount: 59.99, due: "2026-04-22", status: "overdue", category: "Utilities" },
  { id: "b4", name: "Mobile Plan", amount: 45, due: "2026-04-18", status: "paid", category: "Utilities" },
  { id: "b5", name: "Credit Card", amount: 320, due: "2026-05-02", status: "pending", category: "Finance" },
];

export const defaultSettings: UserSettings = {
  notifications: true,
  emailDigest: false,
  weekStartsMonday: true,
  language: "English",
};
