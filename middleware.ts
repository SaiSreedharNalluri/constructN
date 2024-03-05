import { NextRequest, NextResponse } from "next/server";
import { isMultiverseEnabled } from "./utils/constants";

export function middleware(req:NextRequest) {
  const { pathname } = req.nextUrl;

  if (isMultiverseEnabled) {
    return NextResponse.redirect(new URL(req.nextUrl.pathname+ "/"+req.nextUrl.searchParams.get("structId")+"/multiverseviewer"+req.nextUrl.search, req.nextUrl));
  }

  return NextResponse.next();
}
export const config = {
  matcher: '/projects/:projectId/structure',
}