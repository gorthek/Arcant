import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiUrl = process.env.NEXT_PUBLIC_BOT_API_URL || 'http://localhost:4000';
    
    try {
      const botRes = await fetch(`${apiUrl}/api/server/${params.id}/structure`, {
        signal: AbortSignal.timeout(4000) 
      });
      
      if (botRes.ok) {
        const data = await botRes.json();
        return NextResponse.json(data);
      }
    } catch (e) {
      console.warn(`Bot API not responding for server ${params.id} structure. Using fallback.`);
    }

    // High availability fallback: If the bot is completely unreachable, provide a minimal structure
    // so the dashboard doesn't crash completely.
    return NextResponse.json({
      structure: {
        roles: [{ name: "@everyone", color: "#99aab5" }],
        categories: [{ name: "GENERAL", channels: [{ name: "general", type: "text" }] }]
      }
    });

  } catch (error) {
    console.error("Error fetching server structure:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
