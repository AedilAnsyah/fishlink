import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Fishlink API v1 online" });
}
