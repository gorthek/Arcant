"use client";

import About from "../page";
import { SineWaves } from "@/components/animations/SineWaves";

export default function TestD() {
  return (
    <About
      background={
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-gradient-to-b from-[#080b16] via-[#04060b] to-[#020305]">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] bg-teal-500/5 rounded-full blur-[140px] pointer-events-none" />
          <SineWaves />
        </div>
      }
    />
  );
}
