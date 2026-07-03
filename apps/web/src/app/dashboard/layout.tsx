import { ServerProvider } from "@/contexts/ServerContext";
import { DashboardLayoutClient } from "@/components/dashboard/DashboardLayoutClient";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ServerProvider>
      <DashboardLayoutClient>
        {children}
      </DashboardLayoutClient>
    </ServerProvider>
  );
}
