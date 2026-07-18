import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { dbConnect, Server } from "@arcant/database";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    // We try to find the server
    const server = await Server.findOne({ serverId: id });
    if (!server) {
      // If server doesn't exist in DB yet, return defaults
      return NextResponse.json({
        settings: {
          raidMode: false,
          antiLink: true,
          antiSpamSensitivity: "medium",
          logChannelId: "",
          muteDuration: "10m",
          blacklistedWords: [],
          isPremium: false,
          isLifetimePremium: false
        }
      });
    }

    return NextResponse.json({
      settings: {
        raidMode: server.raidMode,
        antiLink: server.antiLink,
        antiSpamSensitivity: server.antiSpamSensitivity,
        logChannelId: server.logChannelId,
        muteDuration: server.muteDuration,
        blacklistedWords: server.blacklistedWords,
        isPremium: server.isPremium,
        isLifetimePremium: server.isLifetimePremium
      }
    });
  } catch (error) {
    console.error("Error fetching server settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    await dbConnect();

    // Check if user is admin of the server - ideally via Discord API or DB
    // For now, we update the DB
    const server = await Server.findOneAndUpdate(
      { serverId: id },
      { $set: body },
      { new: true, upsert: true }
    );

    // TODO: Publish event to Redis for Bot to sync instantly

    return NextResponse.json({ success: true, settings: server });
  } catch (error) {
    console.error("Error updating server settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
