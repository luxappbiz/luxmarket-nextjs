"use server";

import {
  clearSessionAction as clearSessionFromLib,
  getCurrentUser as getCurrentUserFromLib,
  getCurrentUserAuthToken as getCurrentUserAuthTokenFromLib,
  getCurrentUserToken as getCurrentUserTokenFromLib,
  getLuxUserAuth as getLuxUserAuthFromLib,
  loginAction as loginActionFromLib,
  logout as logoutFromLib,
  setUser as setUserFromLib,
} from "@/lib/auth";
import { UserProps } from "@/types/user";

export async function loginAction({
  token,
  user,
  appPassword,
}: {
  token: string;
  user?: UserProps;
  appPassword?: string;
}) {
  return loginActionFromLib({ token, user, appPassword });
}

export async function clearSessionAction() {
  return clearSessionFromLib();
}

export async function logout() {
  return logoutFromLib();
}

export async function getCurrentUser() {
  return getCurrentUserFromLib();
}

export async function setUser(user: UserProps) {
  return setUserFromLib(user);
}

export async function getCurrentUserToken() {
  return getCurrentUserTokenFromLib();
}

export async function getCurrentUserAuthToken() {
  return getCurrentUserAuthTokenFromLib();
}

export async function getLuxUserAuth() {
  return getLuxUserAuthFromLib();
}
