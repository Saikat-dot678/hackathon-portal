import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/db";
import Team from "@/models/Team";

// GET all teams from MongoDB
export async function GET() {
  try {
    await connectDB();
    const teams = await Team.find({}); // Fetch all from Mongo
    return NextResponse.json({ success: true, data: teams });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST new team to MongoDB
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    // Keeping your teammate's logic for ID and status
    const newTeamData = {
      ...body,
      id: `T-${Math.floor(Math.random() * 900) + 100}`,
      status: 'pending'
    };

    const savedTeam = await Team.create(newTeamData);
    
    return NextResponse.json({ success: true, data: savedTeam }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}