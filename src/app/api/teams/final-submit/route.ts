import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/db";
import Team from "@/models/Team";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { teamName, password, githubLink, liveLink } = await request.json();

    // 1. Verify the Team and Password
    const team = await Team.findOne({ name: teamName, password: password });
    if (!team) {
      return NextResponse.json({ success: false, error: 'Invalid Team Name or Password.' }, { status: 401 });
    }

    // 2. Security Check: Are they actually a finalist?
    if (team.status !== 'finalist' && !team.status.includes('winner')) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Only officially selected Finalist teams can submit final projects.' }, { status: 403 });
    }

    // 3. Prevent overwriting if already submitted (Optional: remove if you want to allow resubmissions)
    if (team.githubLink) {
      return NextResponse.json({ success: false, error: 'Your team has already submitted the final project links.' }, { status: 403 });
    }

    // 4. Update the final links
    team.githubLink = githubLink;
    team.liveLink = liveLink;
    
    // Upgrade status to indicate they have finished the hackathon
    team.status = 'COMPLETED';
    
    await team.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Final project links secured! Congratulations on completing the hackathon.'
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}