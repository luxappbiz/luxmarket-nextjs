import { NextRequest, NextResponse } from "next/server";
import {
  getCommerceBaseUrl,
  getWooBasicAuthHeader,
} from "@/lib/server/commerce";

function buildTargetUrl(path: string[], request: NextRequest) {
  const search = request.nextUrl.search || "";
  return `${getCommerceBaseUrl()}/wp-json/${path.join("/")}${search}`;
}

async function proxyRequest(request: NextRequest, path: string[]) {
  const targetUrl = buildTargetUrl(path, request);
  const contentType = request.headers.get("content-type");
  const shouldUseWooAuth = path[0] === "wc";

  const headers = new Headers({
    Accept: request.headers.get("accept") || "application/json",
  });

  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  const customerToken = request.headers.get("x-customer-token");
  if (customerToken) {
    headers.set("X-Customer-Token", customerToken);
  }

  if (shouldUseWooAuth) {
    headers.set("Authorization", getWooBasicAuthHeader());
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    cache: "no-store",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }

  const response = await fetch(targetUrl, init);
  const body = await response.text();

  return new NextResponse(body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") || "application/json",
    },
  });
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}
