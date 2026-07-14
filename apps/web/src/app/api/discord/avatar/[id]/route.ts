import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  const botToken = process.env.DISCORD_TOKEN || process.env.DISCORD_BOT_TOKEN;

  if (botToken) {
    try {
      const res = await fetch(`https://discord.com/api/v10/users/${id}`, {
        headers: {
          Authorization: `Bot ${botToken}`,
        },
        next: { revalidate: 3600 }, // Cache 1 hour
      });

      if (res.ok) {
        const data = await res.json();
        if (data.avatar) {
          const extension = data.avatar.startsWith("a_") ? "gif" : "png";
          const avatarUrl = `https://cdn.discordapp.com/avatars/${id}/${data.avatar}.${extension}?size=256`;
          return NextResponse.redirect(avatarUrl);
        }
      }
    } catch (err) {
      console.error("[Discord Avatar API] Fetch error:", err);
    }
  }

  // Fallback to local team image if available
  const requestUrl = new URL(request.url);
  const fallbackUrl = new URL("/logo.png", requestUrl.origin);
  return NextResponse.redirect(fallbackUrl.toString());
}
