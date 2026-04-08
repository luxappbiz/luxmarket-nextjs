"use client";

import { UserProps } from "@/types/user";

export const SESSION_KEYS = {
  user: "lux_user",
  token: "lux_auth_token",
  appPassword: "lux_app_password",
} as const;

export const AUTH_STATE_CHANGED_EVENT = "authStateChanged";

export type SessionUser = UserProps & {
  token?: string;
  application_password?: string;
};

function dispatchAuthStateChanged() {
  window.dispatchEvent(new Event(AUTH_STATE_CHANGED_EVENT));
}

export function readStoredUser(): SessionUser | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(SESSION_KEYS.user);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as SessionUser;
  } catch (error) {
    console.error("Error parsing stored user:", error);
    return null;
  }
}

export function writeSession(
  token: string,
  user: SessionUser,
  appPassword?: string
) {
  if (typeof window === "undefined") return;

  const sessionUser = {
    ...user,
    token,
    application_password: appPassword,
  };

  localStorage.setItem(SESSION_KEYS.user, JSON.stringify(sessionUser));
  localStorage.setItem(SESSION_KEYS.token, token);

  if (appPassword) {
    localStorage.setItem(SESSION_KEYS.appPassword, appPassword);
  } else {
    localStorage.removeItem(SESSION_KEYS.appPassword);
  }

  dispatchAuthStateChanged();
}

export function updateStoredUser(userData: Partial<SessionUser>) {
  if (typeof window === "undefined") return null;

  const currentUser = readStoredUser();
  if (!currentUser) return null;

  const nextUser = { ...currentUser, ...userData };
  localStorage.setItem(SESSION_KEYS.user, JSON.stringify(nextUser));
  dispatchAuthStateChanged();
  return nextUser;
}

export function clearStoredSession() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(SESSION_KEYS.user);
  localStorage.removeItem(SESSION_KEYS.token);
  localStorage.removeItem(SESSION_KEYS.appPassword);
  dispatchAuthStateChanged();
}
