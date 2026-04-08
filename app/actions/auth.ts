"use server";
import { UserProps } from '@/types/user';
import axios from 'axios';
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';

export async function loginAction({
  token,
  user,
}: {
  token: string;
  user?: UserProps;  // Use UserProps instead of any or Record
}) {
  const cookieStore = await cookies();
  // Set secure, HttpOnly auth_token
  cookieStore.set("lux_auth_token", token, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    secure: true,
    httpOnly: true, // can't be read by JavaScript
    sameSite: "lax",
  });
  // (Optional) If you need some safe client-accessible info
  if (user) {
    cookieStore.set("lux_user", JSON.stringify(user), {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      secure: true,
      httpOnly: false, // accessible via JS
      sameSite: "lax",
    });
  }
  return { success: true };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('lux_auth_token')
  cookieStore.delete('lux_user')
  return redirect('/login'); 
}

export async function getCurrentUser(): Promise<UserProps> {
  const cookieStore = await cookies();
  const user = cookieStore.get('lux_user')?.value || '{}';
  return JSON.parse(user) as UserProps;
}

export async function setUser(user: UserProps) {
  const cookieStore = await cookies();
  cookieStore.set("lux_user", JSON.stringify(user), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secure: true,
    httpOnly: false, // accessible via JS
    sameSite: "lax",
  });
}

export async function getCurrentUserToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("lux_auth_token")?.value;
}

export async function getCurrentUserAuthToken(): Promise<string|null> {
  const authToken = await getCurrentUserToken();
  const user = await getCurrentUser();

  // Provide fallback empty string if user_login or authToken is undefined
  const userLogin = user?.user_login || "";
  const token = authToken || "";
  if (!userLogin && !token) {
    return null
  }
  return btoa(`${userLogin}:${token}`);
}

export async function getUserAutoLoginToken() {
  const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/wp-json/lux/v1/auto-login`;
  try {
    const _getCurrentUserAuthToken = await getCurrentUserAuthToken()
    const res = await axios.post(apiUrl, null, {
      headers: {
        'Authorization': `Basic ${_getCurrentUserAuthToken}`,
      },
    });
    return res.data
  } catch (error) {
    console.error('Error fetching auto-login token:', error);
    return false;
  }
}

export const updateUserProfileImage = async (previewImageFile: File|null) => {
  if (!previewImageFile) {
    return
  }
  const formData = new FormData();
  formData.append("profile_image", previewImageFile);
  try {
    const _getCurrentUserAuthToken = await getCurrentUserAuthToken();
    const res = await axios.post(
      process.env.NEXT_PUBLIC_BASE_URL + '/wp-json/app/v1/user/',
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization': 'Basic ' + _getCurrentUserAuthToken,
        },
      }
    );
    if (res.data && res.data.success && res.data.user_data && res.data.user_data.profile_avatar_url) {
      const user = await getCurrentUser();
      user.image = res.data.user_data.profile_avatar_url[0]
      await setUser(user)
    }
    return res.data
  } catch (err) {
    console.error(err)
    return err
  }
};
