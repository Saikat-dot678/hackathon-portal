import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/db";
import SystemConfig from "@/models/SystemConfig";

// GET: Fetch the current system state
export async function GET() {
  try {
    await connectDB();
    let config = await SystemConfig.findOne({});
    
    // Fallback if the database document hasn't been created manually yet
    if (!config) {
      config = {
        activePhase: 'registration',
        liveStage: 'mentoring_2',
        timeline: {}
      };
    }
    
    return NextResponse.json({ success: true, data: config });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH: Admin updates the global phase or timeline dates
export async function PATCH(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    let config = await SystemConfig.findOne({});
    
    // If the admin tries to update before a document exists, initialize it
    if (!config) {
      config = new SystemConfig();
    }
    
    if (body.activePhase) config.activePhase = body.activePhase;
    if (body.liveStage) config.liveStage = body.liveStage;
    
    if (body.timeline) {
      config.timeline = { ...config.timeline, ...body.timeline };
    }
    
    await config.save();

    return NextResponse.json({ success: true, data: config });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to update system state' }, { status: 400 });
  }
}