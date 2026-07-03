"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BotOwnerGlobalDashboard } from "@/components/dashboard/roles/BotOwnerGlobalDashboard";
import { InteractiveBackground } from "@/components/dashboard/InteractiveBackground";
import { Loader2, ShieldAlert } from "lucide-react";

export default function AdminGlobalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    // @ts-ignore
    const userId = session?.user?.id;
    if (userId === "1061340110219640905") {
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }
  }, [session, status, router]);

  if (status === "loading" || authorized === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-teal-400 bg-black">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-bold">Chargement des données administratives...</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-black px-6 text-center">
        <InteractiveBackground />
        <div className="max-w-md bg-zinc-950/80 border border-red-500/20 rounded-3xl p-8 backdrop-blur-md relative z-10 space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-500">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-2xl font-black text-white">Accès Non Autorisé</h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Cette zone est strictement réservée au propriétaire suprême du bot (CEO). Vos identifiants ne vous accordent pas les droits d'accès à cette interface.
          </p>
          <button 
            onClick={() => router.push("/dashboard")}
            className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-all border border-white/5"
          >
            Retourner au Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-full">
      <InteractiveBackground />
      <div className="max-w-5xl mx-auto pt-10 px-6 pb-20 relative z-10">
        <BotOwnerGlobalDashboard />
      </div>
    </div>
  );
}
