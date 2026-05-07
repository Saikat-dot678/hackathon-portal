import { NextResponse } from 'next/server';

// Mock database (replace with Mongoose models later)
let teamsDB = [
  { id: "T-042", name: "Cyber Ninjas", track: "Cybersecurity", ps: "Smart Grid Defender", ppt: "link.pdf", status: "pending" },
  { id: "T-089", name: "Neural Nomads", track: "Artificial Intelligence", ps: "Predictive Healthcare", ppt: "link.pdf", status: "finalist" },
];

export async function GET() {
  // Add authentication check here later
  return NextResponse.json({ success: true, data: teamsDB });
}

export async function POST(request: Request) {
  try {
    const newTeam = await request.json();
    // Assign an ID and default status
    newTeam.id = `T-${Math.floor(Math.random() * 900) + 100}`;
    newTeam.status = 'pending';
    
    teamsDB.push(newTeam);
    
    return NextResponse.json({ success: true, data: newTeam }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }
}