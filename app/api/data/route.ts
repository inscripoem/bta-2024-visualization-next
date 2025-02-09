import { readFileSync } from "fs";
import * as msgpack from "@msgpack/msgpack";
import { NextResponse } from "next/server";
import path from "path";

interface SchoolAvg {
  school_name: string;
  avg: number;
  nonzero_avg: number;
}

interface TotalAvg {
  avg: number;
  nonzero_avg: number;
}

interface Work {
  title: string;
  total_avg: TotalAvg;
  total_school_avg: TotalAvg;
  school_avg: SchoolAvg[];
}

interface Award {
  name: string;
  works: Work[];
}

interface VoteData {
  stats: {
    total_school_count: number;
    total_vote_count: number;
  };
  schools: Array<{
    name: string;
    location: string;
    vote_count: number;
  }>;
  awards: Award[];
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "vote_analysis_report.msgpack");
    const data = readFileSync(filePath);
    const voteData = msgpack.decode(data) as VoteData;

    return NextResponse.json(voteData);
  } catch (error) {
    console.error("Error reading vote data:", error);
    return NextResponse.json(
      { error: "Failed to read vote data" },
      { status: 500 }
    );
  }
} 