"use server";
import axios from 'axios';
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';

// User interface matching your UserContext
interface User {
  ID: string;
  display_name: string;
  user_login: string;
  user_email: string;
  first_name: string;
  last_name: string;
  phone: string;
  image: string;
  website: string;
  token: string;
  user_nicename: string;
  affiliate_id: number;
  user_registered: string;
  is_event_host: boolean;
  application_password?: string;
}

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
  cookieStore.set("lux_auth_token", token, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,  
    sameSite: "lax",
  });
  if (appPassword) {
    cookieStore.set("app_password", appPassword, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: "lax",
    });
  }
  if (user) {
    cookieStore.set("user_info", JSON.stringify(user), {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false, // accessible via JS
      sameSite: "lax",
    });
  }
  return { success: true };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('lux_auth_token');
  cookieStore.delete('app_password');
  cookieStore.delete('user_info');
  return redirect('/login'); 
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const user_info = cookieStore.get('user_info')?.value;
  if (user_info) {
    try {
      return JSON.parse(user_info) as User;
    } catch {
      // Continue to check localStorage if cookie parsing fails
    }
  }
  // Fallback to check if we can get user from localStorage (for migration)
  if (typeof window !== 'undefined') {
    const localUser = localStorage.getItem('lux_user') || localStorage.getItem('user');
    if (localUser) {
      try {
        return JSON.parse(localUser) as User;
      } catch {
        return null;
      }
    }
  }
  return null;
}

export async function setUser(user: User) {
  const cookieStore = await cookies();
  cookieStore.set("user_info", JSON.stringify(user), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false,
    sameSite: "lax",
  });
}

export async function getCurrentUserToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  let token = cookieStore.get("lux_auth_token")?.value;
  if (!token && typeof window !== 'undefined') {
    token = localStorage.getItem('lux_auth_token') || localStorage.getItem('lux_auth_token') || undefined;
  }
  return token;
}

export async function getCurrentUserAppPassword(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("app_password")?.value;
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
  if (!appPassword && typeof window !== 'undefined') {
    const localAppPassword = localStorage.getItem('lux_app_password');
    if (localAppPassword) {
      appPassword = localAppPassword;
    }
  }
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
