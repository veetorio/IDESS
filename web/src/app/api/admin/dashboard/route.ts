import { NextResponse } from "next/server";
import { getDashboardAtividadeData } from "@/lib/dashboard";

export async function GET() {
  return NextResponse.json(getDashboardAtividadeData());
}
