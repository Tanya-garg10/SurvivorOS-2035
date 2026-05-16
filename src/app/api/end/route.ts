import { NextResponse } from "next/server";
import { generateEnding } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { profile, stats, history } = await req.json();
    const ending = await generateEnding(profile, stats, history);
    return NextResponse.json(ending);
  } catch (error: any) {
    console.error("Ending API Error:", error);
    return NextResponse.json({ error: "Failed to generate ending" }, { status: 500 });
  }
}
