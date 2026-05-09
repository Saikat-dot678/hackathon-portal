import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/db";
import Team from "@/models/Team";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { teamName, password, pptLink } = await request.json();

    // 1. Basic validation
    if (!pptLink || !pptLink.startsWith('http')) {
      return NextResponse.json({ success: false, error: 'Please provide a valid URL starting with http:// or https://' }, { status: 400 });
    }

    // 2. Verify the Team and Password
    const team = await Team.findOne({ name: teamName, password: password });
    if (!team) {
      return NextResponse.json({ success: false, error: 'Invalid Team Name or Password.' }, { status: 401 });
    }

    // 3. MUST have selected a problem statement first
    if (!team.ps || team.ps === 'Not Selected') {
      return NextResponse.json({ success: false, error: 'Your team must select a Problem Statement before submitting a presentation.' }, { status: 403 });
    }

    // 4. THE STRICT ONE-TIME SUBMISSION CHECK
    if (team.ppt && team.ppt.trim() !== '') {
      return NextResponse.json({ success: false, error: 'Your team has already submitted a presentation. Resubmissions are not allowed.' }, { status: 403 });
    }

    // 5. Update the PPT link and status
    team.ppt = pptLink;
    team.status = 'SUBMITTED';
    
    await team.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Presentation link submitted successfully!'
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}