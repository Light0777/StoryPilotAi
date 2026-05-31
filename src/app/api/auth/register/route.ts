import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { message: "Auth is now handled by Clerk. Use /sign-up instead." },
    { status: 410 }
  );
}
