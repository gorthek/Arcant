import { useServerContext, ServerRole } from "@/contexts/ServerContext";

export function useServerRole(serverId?: string) {
  const context = useServerContext();
  return { 
    role: context.role, 
    cycleRole: context.cycleRole 
  };
}
