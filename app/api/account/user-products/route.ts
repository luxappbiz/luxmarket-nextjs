import { NextRequest, NextResponse } from "next/server";
import { getLuxUserAuth } from "@/lib/auth";
import { getLuxApiBaseUrl } from "@/lib/server/commerce";

export async function GET(request: NextRequest) {
  try {
    const userAuth = await getLuxUserAuth();

    if (!userAuth) {
      return NextResponse.json(
        { success: false, message: "User not authenticated", products: [] },
        { status: 401 }
      );
    }

    const auth = Buffer.from(
      `${userAuth.userLogin}:${userAuth.appPassword}`
    ).toString("base64");
    const search = request.nextUrl.search || "";

    const response = await fetch(
      `${getLuxApiBaseUrl()}/wp-json/lux/v1/user-products/${search}`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
        cache: "no-store",
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data?.message || "Failed to fetch products",
          products: [],
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("User products proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products", products: [] },
      { status: 500 }
    );
  }
}
