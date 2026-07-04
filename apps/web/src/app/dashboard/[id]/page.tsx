"use client";

import { useServerRole } from "@/hooks/useServerRole";
import { OwnerDashboard } from "@/components/dashboard/roles/OwnerDashboard";
import { AdminDashboard } from "@/components/dashboard/roles/AdminDashboard";
import { MemberDashboard } from "@/components/dashboard/roles/MemberDashboard";
import { motion } from "framer-motion";
import { Loader2, Users } from "lucide-react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ServerSettings() {
  const params = useParams();
  const serverId = params?.id as string | undefined;
  const { role, cycleRole } = useServerRole(serverId);
  const { data: session } = useSession();

  // @ts-ignore
  const isCeo = session?.user?.id === "1061340110219640905";

  if (role === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-teal-500">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="text-gray-400 font-bold animate-pulse">Analyse des habilitations...</p>
      </div>
    );
  }

  // Obtenir un titre de rôle lisible pour la simulation
  const getRoleName = () => {
    switch(role) {
      case "owner": return "Créateur Bot (CEO)";
      case "server_owner": return "Propriétaire Serveur";
      case "admin": return "Administrateur";
      case "member": return "Membre Ordinaire";
      default: return role;
    }
  };

  return (
    <div className="relative">
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

      {/* Rôle Toggler flottant pour le CEO pour tester et basculer instantanément */}
      {isCeo && (
        <div className="fixed bottom-6 right-6 z-50">
          <button 
            onClick={cycleRole}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-teal-500 via-emerald-500 to-indigo-600 text-black font-black text-xs uppercase tracking-wider hover:scale-105 transition-all shadow-[0_0_20px_rgba(20,184,166,0.4)] border border-white/20"
          >
            <Users size={14} />
            Basculer le rôle ({getRoleName()})
          </button>
        </div>
      )}
    </div>
  );
}
