import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In a real high-availability system, this would query a Redis cache 
    // populated by the Bot in real-time.
    // For now, we will simulate reading from the Bot's cache or direct API
    const apiUrl = process.env.NEXT_PUBLIC_BOT_API_URL || 'http://localhost:4000';
    
    try {
      const botRes = await fetch(`${apiUrl}/api/server/${id}/stats`, {
        // High Availability: short timeout so dashboard doesn't hang if bot is dead
        signal: AbortSignal.timeout(3000) 
      });
      
      if (botRes.ok) {
        const stats = await botRes.json();
        return NextResponse.json(stats);
      }
    } catch (e) {
      console.warn(`Bot API not responding for server ${id} stats. Using fallback.`);
    }

    // Fallback if Bot is offline or Redis is missing
    return NextResponse.json({
      _fallback: true,
      memberCount: 0,
      boostCount: 0,
      boostTier: 0,
      botOnline: false,
      botLatency: -1,
      totalChannels: 0,
      textChannels: 0,
      voiceChannels: 0
    });

  } catch (error) {
    console.error("Error fetching server stats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
