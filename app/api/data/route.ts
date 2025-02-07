import { readFileSync } from "fs";
import * as msgpack from "@msgpack/msgpack";
import { NextResponse } from "next/server";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "vote_analysis_report.msgpack");
    const data = readFileSync(filePath);
    const voteData = msgpack.decode(data) as {
      schools: Array<{
        name: string;
        location: string;
        vote_count: number;
      }>;
    };

    return NextResponse.json(voteData);
  } catch (error) {
    console.error("Error reading vote data:", error);
    return NextResponse.json(
      { error: "Failed to read vote data" },
      { status: 500 }
    );
  }
} 