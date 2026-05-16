import { NextResponse } from "next/server";
import { generateScenario } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { profile, stats } = await req.json();
    
    if (!profile || !stats) {
      return NextResponse.json({ error: "Missing profile or stats" }, { status: 400 });
    }

    const scenario = await generateScenario(profile, stats);
    return NextResponse.json(scenario);
  } catch (error: any) {
    console.error("Simulation API Error:", error);
    // If it's a Groq JSON validation error, log the failed generation
    if (error.failed_generation) {
      console.error("FAILED GENERATION:", error.failed_generation);
    }
    return NextResponse.json({ 
      error: error.message || "Failed to generate scenario",
      details: error.failed_generation || null
    }, { status: 500 });
  }
}


