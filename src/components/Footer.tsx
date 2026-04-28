
'use client';

import { useEffect, useState } from 'react';

export function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-border/40 py-12 bg-background hidden md:block">
      <div className="container mx-auto px-4 text-center">
        <p className="font-headline tracking-[0.3em] text-[10px] font-bold text-black/30 uppercase mb-4">
          Quantum Nest • Cosmic Insights Protocol
        </p>
        <p className="text-black/40 text-xs">
          © {year || '...'} Dedicated to human exploration and archival integrity.
        </p>
      </div>
    </footer>
  );
}
