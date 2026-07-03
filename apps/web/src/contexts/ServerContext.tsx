"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

export type ServerRole = "owner" | "server_owner" | "admin" | "member" | "loading";

interface GuildData {
  id: string;
  name: string;
  icon: string | null;
}

interface ServerContextType {
  role: ServerRole;
  guild: GuildData | null;
  cycleRole: () => void;
  isLoading: boolean;
}

const ServerContext = createContext<ServerContextType | undefined>(undefined);

export function ServerProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const params = useParams();
  const serverId = params?.id as string | undefined;

  const [role, setRole] = useState<ServerRole>("loading");
  const [guild, setGuild] = useState<GuildData | null>(null);
  const [overrideRole, setOverrideRole] = useState<ServerRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!serverId) {
        setIsLoading(false);
        setRole("member");
        return;
      }

      // @ts-ignore
      const userId = session?.user?.id;
      // @ts-ignore
      const accessToken = session?.accessToken;

      if (!session || !accessToken) {
        setRole("member");
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("https://discord.com/api/users/@me/guilds", {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        
        if (!res.ok) {
          setRole("member");
          setIsLoading(false);
          return;
        }
        
        const guilds = await res.json();
        const foundGuild = guilds.find((g: any) => g.id === serverId);

        if (!foundGuild) {
          setRole("member");
          setIsLoading(false);
          return;
        }

        setGuild({
          id: foundGuild.id,
          name: foundGuild.name,
          icon: foundGuild.icon,
        });

        // Détermination du Rôle
        if (userId === "1061340110219640905") {
          // CEO (Owner global)
          setRole("owner");
        } else if (foundGuild.owner) {
          setRole("server_owner");
        } else {
          const perms = BigInt(foundGuild.permissions);
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
      } finally {
        setIsLoading(false);
      }
    }

    if (overrideRole) {
      setRole(overrideRole);
      // Wait for fetch to get guild data if we don't have it, but role is overridden
      if (!guild) {
        fetchData();
      }
    } else {
      fetchData();
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

  return (
    <ServerContext.Provider value={{ role: overrideRole || role, guild, cycleRole, isLoading }}>
      {children}
    </ServerContext.Provider>
  );
}

export function useServerContext() {
  const context = useContext(ServerContext);
  if (context === undefined) {
    throw new Error("useServerContext must be used within a ServerProvider");
  }
  return context;
}
