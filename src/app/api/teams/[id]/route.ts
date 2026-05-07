import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } } // Next.js automatically extracts the [id] from the URL
) {
  try {
    const teamId = params.id;
    const body = await request.json(); // e.g., { status: 'finalist' }

    // In a real database: await Team.findOneAndUpdate({ id: teamId }, { status: body.status });
    
    return NextResponse.json({ 
      success: true, 
      message: `Team ${teamId} updated to ${body.status}` 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 400 });
  }
}