import { NextResponse } from 'next/server';

// Mocking a database for now - eventually replace with Mongoose
let systemState = {
  activePhase: 'registration',
  liveStage: 'mentoring_2'
};

// GET: Fetch the current system state
export async function GET() {
  return NextResponse.json({ success: true, data: systemState });
}

// PATCH: Admin updates the global phase
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    
    // Update the state
    if (body.activePhase) systemState.activePhase = body.activePhase;
    if (body.liveStage) systemState.liveStage = body.liveStage;

    return NextResponse.json({ success: true, data: systemState });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update system state' }, { status: 400 });
  }
}