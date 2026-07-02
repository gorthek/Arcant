import { NextResponse } from 'next/server';
import { dbConnect, Server } from '@arcant/database';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { serverIds } = body;

    if (!serverIds || !Array.isArray(serverIds)) {
      return NextResponse.json({ error: 'serverIds array is required' }, { status: 400 });
    }

    // Tente de se connecter à la DB
    try {
      await dbConnect();
    } catch (dbError) {
      // Si la DB n'est pas encore configurée (ex: pas de MONGO_URI), on renvoie un tableau vide
      // pour ne pas faire crash le site en production le temps que le CEO configure Vercel.
      console.warn("MongoDB non connecté :", dbError);
      return NextResponse.json({ servers: [] });
    }

    // Cherche les serveurs dans la DB qui correspondent aux IDs envoyés
    const foundServers = await Server.find({ serverId: { $in: serverIds } }).lean();

    return NextResponse.json({ servers: foundServers });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
