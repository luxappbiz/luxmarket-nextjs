import { NextResponse } from "next/server";
import { getLuxUserAuth } from "@/lib/auth";
import { getLuxApiBaseUrl } from "@/lib/server/commerce";

export async function POST(request: Request) {
  try {
    const userAuth = await getLuxUserAuth();

    if (!userAuth) {
      return NextResponse.json(
        { success: false, message: "User not authenticated. Please login again." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const auth = Buffer.from(
      `${userAuth.userLogin}:${userAuth.appPassword}`
    ).toString("base64");

    const response = await fetch(
      `${getLuxApiBaseUrl()}/wp-json/lux/v1/create-product/`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
        },
        body: formData,
        cache: "no-store",
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message:
            data?.message || response.statusText || "Failed to create product.",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Create product proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create product. Please try again." },
      { status: 500 }
    );
  }
}
