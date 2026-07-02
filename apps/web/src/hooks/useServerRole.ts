import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export type ServerRole = "owner" | "server_owner" | "admin" | "member" | "loading";

export function useServerRole(serverId?: string) {
  const { data: session } = useSession();
  const [role, setRole] = useState<ServerRole>("loading");
  // Permet au CEO de forcer un rôle pour tester le design
  const [overrideRole, setOverrideRole] = useState<ServerRole | null>(null);

  useEffect(() => {
    async function fetchRole() {
      // @ts-ignore
      const userId = session.user?.id;
      // @ts-ignore
      const accessToken = session.accessToken;

      // CEO Bypass default
      if (userId === "1061340110219640905") {
        setRole("owner");
        return;
      }

      if (!serverId || !session) {
        setRole("member");
        return;
      }

      if (!accessToken) {
        // Fallback si pas de token
        setRole("member");
        return;
      }

      // CEO Bypass default
      if (userId === "1061340110219640905") {
        setRole("owner");
        return;
      }

      try {
        const res = await fetch("https://discord.com/api/users/@me/guilds", {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (!res.ok) {
          setRole("member");
          return;
        }
        const guilds = await res.json();
        const guild = guilds.find((g: any) => g.id === serverId);

        if (!guild) {
          setRole("member");
          return;
        }

        if (guild.owner) {
          setRole("server_owner");
        } else {
          const perms = BigInt(guild.permissions);
          const isAdmin = (perms & BigInt(0x8)) === BigInt(0x8);
          const isManager = (perms & BigInt(0x20)) === BigInt(0x20);
          
          if (isAdmin || isManager) {
            setRole("admin");
          } else {
            setRole("member");
          }
        }
      } catch (e) {
        console.error(e);
        setRole("member");
      }
    }

    if (overrideRole) {
      setRole(overrideRole);
    } else {
      fetchRole();
    }
  }, [session, serverId, overrideRole]);

  const cycleRole = () => {
    // @ts-ignore
    if (session?.user?.id === "1061340110219640905") { // CEO ID
      setOverrideRole((current) => {
        const currentRole = current || role;
        if (currentRole === "owner") return "server_owner";
        if (currentRole === "server_owner") return "admin";
        if (currentRole === "admin") return "member";
        return "owner";
      });
    }
  };

  return { role: overrideRole || role, cycleRole };
}
