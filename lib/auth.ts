"use server";
import axios from 'axios';
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';
import { UserProps } from "@/types/user";

const COOKIE_NAMES = {
  token: "lux_auth_token",
  user: "lux_user",
  appPassword: "lux_app_password",
  legacyUser: "user_info",
  legacyAppPassword: "app_password",
} as const;

type User = UserProps & {
  token?: string;
  application_password?: string;
};

export async function loginAction({
  token,
  user,
  appPassword,
}: {
  token: string;
  user?: User;
  appPassword?: string;
}) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAMES.token, token, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,  
    sameSite: "lax",
  });
  if (appPassword) {
    cookieStore.set(COOKIE_NAMES.appPassword, appPassword, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: "lax",
    });
  }
  if (user) {
    cookieStore.set(COOKIE_NAMES.user, JSON.stringify(user), {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false, // accessible via JS
      sameSite: "lax",
    });
  }
  return { success: true };
}

export async function clearSessionAction() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAMES.token);
  cookieStore.delete(COOKIE_NAMES.user);
  cookieStore.delete(COOKIE_NAMES.appPassword);
  cookieStore.delete(COOKIE_NAMES.legacyUser);
  cookieStore.delete(COOKIE_NAMES.legacyAppPassword);
  return { success: true };
}

export async function logout() {
  await clearSessionAction();
  return redirect('/login'); 
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const user_info =
    cookieStore.get(COOKIE_NAMES.user)?.value ||
    cookieStore.get(COOKIE_NAMES.legacyUser)?.value;
  if (user_info) {
    try {
      return JSON.parse(user_info) as User;
    } catch {
      return null;
    }
  }
  return null;
}

export async function setUser(user: User) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAMES.user, JSON.stringify(user), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false,
    sameSite: "lax",
  });
}

export async function getCurrentUserToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAMES.token)?.value;
}

export async function getCurrentUserAppPassword(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return (
    cookieStore.get(COOKIE_NAMES.appPassword)?.value ||
    cookieStore.get(COOKIE_NAMES.legacyAppPassword)?.value
  );
}

export async function getCurrentUserAuthToken(): Promise<string> {
  const authToken = await getCurrentUserToken();
  const appPassword = await getCurrentUserAppPassword();
  const user = await getCurrentUser();
  const password = appPassword || authToken || "";
  const userLogin = user?.user_login || "";
  return btoa(`${userLogin}:${password}`);
}

export async function getLuxUserAuth(): Promise<{ userLogin: string; appPassword: string } | null> {
  const user = await getCurrentUser();
  let appPassword = await getCurrentUserAppPassword();
  // If still no app password, use the token as fallback
  if (!appPassword) {
    const token = await getCurrentUserToken();
    if (token) {
      appPassword = token;
    }
  }
  if (!user?.user_login || !appPassword) {
    return null;
  }
  return {
    userLogin: user.user_login,
    appPassword: appPassword
  };
}
