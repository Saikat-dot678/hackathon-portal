import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/db";
import SystemConfig from "@/models/SystemConfig";
import Team from "@/models/Team";
import Problem from "@/models/ProblemStatement";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    let config = await SystemConfig.findOne({});
    if (!config) {
      config = await SystemConfig.create({});
    }
    return NextResponse.json({ success: true, data: config });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Create a dynamic update object based on what is being sent
    const updateData: any = {};
    if (body.activePhase !== undefined) updateData.activePhase = body.activePhase;
    if (body.liveStage !== undefined) updateData.liveStage = body.liveStage;
    if (body.timeline !== undefined) updateData.timeline = body.timeline;
    if (body.panels !== undefined) updateData.panels = body.panels; 

    // findOneAndUpdate with upsert: true forces MongoDB to update it directly.
    const config = await SystemConfig.findOneAndUpdate(
      {}, 
      { $set: updateData },
      { returnDocument: 'after', upsert: true } // <--- Updated!
    );

    return NextResponse.json({ success: true, data: config });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await connectDB();

    // 1. Wipe all registered teams
    await Team.deleteMany({});

    // 2. Reset Problem Statement capacities back to 0
    await Problem.updateMany({}, { $set: { selectedTeamsCount: 0 } });

    // 3. Reset the Global Phases and Panels (Keeps the timeline intact!)
    const config = await SystemConfig.findOneAndUpdate(
      {},
      { 
        $set: { 
          activePhase: 'registration', 
          liveStage: 'opening',
          panels: [] 
        } 
      },
      { new: true }
    );

    return NextResponse.json({ 
      success: true, 
      message: "System successfully reset for a new test run." 
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}