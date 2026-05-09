import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/db";
import ProblemStatement from "@/models/ProblemStatement";

// FIX: Forces Next.js to skip the cache and always fetch fresh data from MongoDB
export const dynamic = 'force-dynamic'; 

export async function GET() {
  try {
    await connectDB();
    const problems = await ProblemStatement.find({});
    return NextResponse.json({ success: true, data: problems });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Auto-generate a PS ID (e.g., PS-101)
    if (!body.psId) {
      body.psId = `PS-${Math.floor(Math.random() * 900) + 100}`;
    }

    const newProblem = await ProblemStatement.create(body);
    return NextResponse.json({ success: true, data: newProblem }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}