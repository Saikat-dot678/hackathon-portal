import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/db";
import Team from "@/models/Team";

export async function PATCH(
  request: Request,
  // 1. Update the type to expect a Promise
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    await connectDB();
    
    // 2. Await the params before trying to read the ID
    const resolvedParams = await params;
    const teamId = resolvedParams.id;
    
    const body = await request.json(); // e.g., { status: 'finalist' }

    // Update the team in the database
    const updatedTeam = await Team.findOneAndUpdate(
      { id: teamId }, 
      { status: body.status },
      { new: true } // Return the updated document
    );

    if (!updatedTeam) {
      return NextResponse.json({ success: false, error: 'Team not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedTeam });
    
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}