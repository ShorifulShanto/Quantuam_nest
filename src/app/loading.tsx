"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
      <div className="relative flex items-center justify-center">
        {/* Lighter, non-blocking orbital animation */}
        <div className="absolute w-16 h-16 rounded-full border border-primary/10 animate-spin" style={{ animationDuration: '2s' }} />
        
        <div className="absolute w-16 h-16 animate-orbit">
          <div className="w-2 h-2 bg-accent rounded-full shadow-[0_0_8px_rgba(0,212,255,0.6)]" />
        </div>

        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
          <Loader2 className="w-4 h-4 text-primary animate-spin" />
        </div>
      </div>
      
      <p className="mt-6 font-headline text-xs font-bold tracking-[0.2em] text-primary/60 uppercase">
        Scanning Cosmos...
      </p>
    </div>
  );
}
