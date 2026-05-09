import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/db";
import ProblemStatement from "@/models/ProblemStatement";
import Team from "@/models/Team";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { teamName, password, psId } = await request.json();

    // 1. Verify the Team and Password
    const team = await Team.findOne({ name: teamName, password: password });
    if (!team) {
      return NextResponse.json({ success: false, error: 'Invalid Team Name or Password.' }, { status: 401 });
    }

    // 2. Check if team already selected a problem
    if (team.ps && team.ps !== 'Not Selected') {
      return NextResponse.json({ success: false, error: 'Your team has already selected a problem statement.' }, { status: 400 });
    }

    // 3. THE CONCURRENCY LOCK: Try to claim a spot atomically
    const problem = await ProblemStatement.findOneAndUpdate(
      { 
        psId: psId, 
        $expr: { $lt: ["$selectedTeamsCount", "$maxTeams"] } 
      },
      { 
        $inc: { selectedTeamsCount: 1 } 
      },
      { new: true }
    );

    // If 'problem' returns null, it means the query didn't match (meaning 0 spots left, or invalid ID)
    if (!problem) {
      const checkExists = await ProblemStatement.findOne({ psId });
      if (!checkExists) return NextResponse.json({ success: false, error: 'Problem Statement not found.' }, { status: 404 });
      
      return NextResponse.json({ success: false, error: 'This problem statement is fully booked.' }, { status: 409 });
    }

    // 4. Spot secured! Update the Team's record
    team.ps = problem.title;
    team.track = problem.domain;
    team.status = 'PROBLEM_SELECTED';
    await team.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Problem Statement successfully locked!'
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}