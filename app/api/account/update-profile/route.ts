import { NextResponse } from "next/server";
import { getLuxUserAuth } from "@/lib/auth";
import { getLuxApiBaseUrl } from "@/lib/server/commerce";

export async function POST(request: Request) {
  try {
    const userAuth = await getLuxUserAuth();

    if (!userAuth) {
      return NextResponse.json(
        { success: false, message: "User not authenticated" },
        { status: 401 }
      );
    }

    const profileData = await request.json();
    const auth = Buffer.from(
      `${userAuth.userLogin}:${userAuth.appPassword}`
    ).toString("base64");

    const response = await fetch(
      `${getLuxApiBaseUrl()}/wp-json/lux/v1/update-profile/`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
        cache: "no-store",
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data?.message || "Failed to update profile" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Update profile proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update profile" },
      { status: 500 }
    );
  }
}
