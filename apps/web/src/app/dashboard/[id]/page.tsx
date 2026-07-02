"use client";

import { useServerRole } from "@/hooks/useServerRole";
import { OwnerDashboard } from "@/components/dashboard/roles/OwnerDashboard";
import { AdminDashboard } from "@/components/dashboard/roles/AdminDashboard";
import { MemberDashboard } from "@/components/dashboard/roles/MemberDashboard";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import { useParams } from "next/navigation";

export default function ServerSettings() {
  const params = useParams();
  const serverId = params?.id as string | undefined;
  const { role } = useServerRole(serverId);

  if (role === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-teal-500">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="text-gray-400 font-bold animate-pulse">Analyse des habilitations...</p>
      </div>
    );
  }

  return (
    <motion.div
      key={role}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
    >
      {role === "owner" || role === "server_owner" ? (
        <OwnerDashboard serverId={serverId!} />
      ) : role === "admin" ? (
        <AdminDashboard serverId={serverId!} />
      ) : (
        <MemberDashboard serverId={serverId!} />
      )}
    </motion.div>
  );
}
