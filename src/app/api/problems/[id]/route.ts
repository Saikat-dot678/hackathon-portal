import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/db";
import Problem from "@/models/ProblemStatement"; 

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const psId = resolvedParams.id; // The custom PS ID (e.g., PS-01)
    
    const body = await request.json();

    const updatedProblem = await Problem.findOneAndUpdate(
      { psId: psId }, 
      { $set: body },
      { new: true }
    );

    if (!updatedProblem) {
      return NextResponse.json({ success: false, error: 'Problem not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedProblem });
    
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const psId = resolvedParams.id;

    const deletedProblem = await Problem.findOneAndDelete({ psId: psId });

    if (!deletedProblem) {
      return NextResponse.json({ success: false, error: 'Problem not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Problem deleted successfully' });
    
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}