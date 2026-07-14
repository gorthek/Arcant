import { NextResponse } from "next/server";
import { dbConnect, User } from "@arcant/database";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  // 1. Check MongoDB Database for saved avatar URL (from NextAuth session / DB)
  try {
    await dbConnect();
    const dbUser = await User.findOne({ discordId: id }).lean();
    if (dbUser?.avatarUrl || dbUser?.image) {
      const dbAvatar = dbUser.avatarUrl || dbUser.image;
      if (dbAvatar && dbAvatar.startsWith("http")) {
        return NextResponse.redirect(dbAvatar);
      }
    }
  } catch (err) {
    console.error("[Discord Avatar API] DB Lookup error:", err);
  }

  // 2. Check Discord API if Bot token is configured
  const botToken = process.env.DISCORD_TOKEN || process.env.DISCORD_BOT_TOKEN;

  if (botToken) {
    try {
      const res = await fetch(`https://discord.com/api/v10/users/${id}`, {
        headers: {
          Authorization: `Bot ${botToken}`,
        },
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.avatar) {
          const extension = data.avatar.startsWith("a_") ? "gif" : "png";
          const avatarUrl = `https://cdn.discordapp.com/avatars/${id}/${data.avatar}.${extension}?size=256`;
          
          // Optionally save in DB asynchronously
          User.updateOne({ discordId: id }, { $set: { avatarUrl, image: avatarUrl } }).catch(() => {});
          
          return NextResponse.redirect(avatarUrl);
        }
      }
    } catch (err) {
      console.error("[Discord Avatar API] Discord API error:", err);
    }
  }

  // 3. Fallback to local team images or default logo
  const requestUrl = new URL(request.url);
  let fallbackPath = "/logo.png";
  if (id === "1061340110219640905") fallbackPath = "/team/gorthek.png";
  if (id === "1320747774891003965") fallbackPath = "/team/c9d88444f43843446209d94cb7779e89.png";
  if (id === "724000427590418453") fallbackPath = "/team/nono.png";

  const fallbackUrl = new URL(fallbackPath, requestUrl.origin);
  return NextResponse.redirect(fallbackUrl.toString());
}
