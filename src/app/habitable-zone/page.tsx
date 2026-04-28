"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sun, ThermometerSnowflake, Waves, Flame, Loader2, Globe, Target, Zap, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const targetExoplanets = [
  { name: "Proxima Centauri b", dist: "4.2 Ly", star: "Proxima Centauri (M-type)", hzIndex: "0.87", temp: "-39°C (est)", notes: "Closest known exoplanet to our solar system." },
  { name: "TRAPPIST-1e", dist: "39 Ly", star: "TRAPPIST-1 (M-type)", hzIndex: "0.91", temp: "-22°C (est)", notes: "Most likely to be a terrestrial water world." },
  { name: "Kepler-452b", dist: "1,402 Ly", star: "Kepler-452 (G-type)", hzIndex: "0.83", temp: "-8°C (est)", notes: "Earth's older, larger cousin." },
  { name: "Kepler-186f", dist: "582 Ly", star: "Kepler-186 (M-type)", hzIndex: "0.64", temp: "-85°C (est)", notes: "First Earth-sized planet found in the HZ." },
  { name: "LHS 1140 b", dist: "41 Ly", star: "LHS 1140 (M-type)", hzIndex: "0.78", temp: "-43°C (est)", notes: "A super-Earth orbiting a quiet red dwarf." }
];

export default function HabitableZonePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && !user) {
      toast({
        title: "Mission Restricted",
        description: "You need to login to launch the mission.",
        variant: "destructive",
      });
      router.push("/login");
    }
  }, [user, isUserLoading, router, toast]);

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12 pb-24 md:pb-12">
      <div className="max-w-3xl mb-12 animate-in fade-in duration-1000">
        <div className="flex items-center gap-3 mb-4">
           <Badge className="bg-primary/20 text-primary border-primary/30 uppercase tracking-widest text-[9px] font-bold">Protocol Goldilocks</Badge>
        </div>
        <h1 className="font-headline text-5xl font-bold mb-6 text-foreground">The Habitable Zone</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          The Habitable Zone (HZ) is the region around a star where conditions are just right for liquid water to exist on a planet's surface. This is the primary target area for the search for extra-terrestrial life.
        </p>
      </div>

      {/* Main Visualization Area */}
      <div className="relative w-full h-[400px] mb-16 rounded-[2.5rem] bg-black/40 border-2 border-primary overflow-hidden flex items-center justify-center shadow-[0_0_30px_rgba(228,54,54,0.15)]">
         <div className="absolute inset-0 bg-stars opacity-20" />
         
         <div className="absolute left-[-100px] w-96 h-96 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 blur-[2px] animate-pulse flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-yellow-500 opacity-20 animate-ping" />
         </div>

         <div className="flex items-center w-full px-16 md:px-48 justify-between relative z-10">
            <div className="flex flex-col items-center gap-3 group">
               <div className="w-10 h-10 rounded-full bg-gray-400 border-2 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]" />
               <span className="text-[10px] text-red-400 font-bold uppercase tracking-[0.2em]">Too Hot</span>
               <Flame className="w-5 h-5 text-red-500 animate-bounce" />
            </div>

            <div className="flex flex-col items-center gap-4 relative">
               <div className="absolute -inset-16 bg-primary/10 rounded-full blur-[60px]" />
               <div className="w-16 h-16 rounded-full bg-blue-500 border-4 border-primary shadow-[0_0_30px_rgba(46,204,113,0.6)] z-20 flex items-center justify-center">
                  <Globe className="w-8 h-8 text-white animate-orbit" />
               </div>
               <span className="text-sm text-primary font-bold uppercase tracking-[0.3em] z-20">EARTH</span>
               <div className="h-1 w-64 md:w-96 bg-primary/20 absolute top-8 -z-10 blur-xl" />
               <div className="text-[10px] text-primary font-headline mt-2 bg-primary/20 px-3 py-1 rounded-full border border-primary/30 uppercase font-bold tracking-widest animate-pulse">OPTIMAL</div>
            </div>

            <div className="flex flex-col items-center gap-3">
               <div className="w-12 h-12 rounded-full bg-blue-100/20 border-2 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
               <span className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em]">Too Cold</span>
               <ThermometerSnowflake className="w-5 h-5 text-blue-400" />
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <Card className="bg-card/30 border-2 border-primary p-2 rounded-[2rem] shadow-[0_0_20px_rgba(228,54,54,0.1)] transition-all hover:shadow-[0_0_30px_rgba(228,54,54,0.15)]">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-3">
              <Waves className="text-primary w-6 h-6" /> The Water Requirement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm leading-relaxed">
              Water is the universal solvent. It facilitates the complex chemical reactions required for biological systems. The HZ is defined specifically as the orbital range where a planet's atmospheric pressure allows for <strong className="text-primary">liquid</strong> water to remain stable on the surface.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/30 border-2 border-primary p-2 rounded-[2rem] shadow-[0_0_20px_rgba(228,54,54,0.1)] transition-all hover:shadow-[0_0_30px_rgba(228,54,54,0.15)]">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-3">
              <Sun className="text-primary w-6 h-6" /> Stellar Variation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm leading-relaxed">
              Every star has a different HZ. A cool M-type Red Dwarf has a habitable zone that is very narrow and close to the star. A massive, hot O-type star has a HZ that is extremely far out. Our G-type Sun provides a stable, wide zone perfectly suited for long-term planetary development.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-1000">
         <h2 className="font-headline text-3xl font-bold flex items-center gap-3">
            <Target className="text-primary w-8 h-8" /> Goldilocks Candidates
         </h2>
         <Card className="bg-card/20 border-2 border-primary overflow-hidden shadow-2xl rounded-[1.5rem]">
            <Table>
              <TableHeader>
                <TableRow className="border-primary/20 bg-white/5 hover:bg-transparent">
                  <TableHead className="text-primary font-bold uppercase tracking-widest text-[10px]">Exoplanet</TableHead>
                  <TableHead className="text-primary font-bold uppercase tracking-widest text-[10px]">Distance</TableHead>
                  <TableHead className="text-primary font-bold uppercase tracking-widest text-[10px]">Star System</TableHead>
                  <TableHead className="text-primary font-bold uppercase tracking-widest text-[10px]">ESI Index</TableHead>
                  <TableHead className="text-primary font-bold uppercase tracking-widest text-[10px]">Est. Temp</TableHead>
                  <TableHead className="hidden lg:table-cell text-primary font-bold uppercase tracking-widest text-[10px]">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {targetExoplanets.map((p) => (
                  <TableRow key={p.name} className="border-primary/10 hover:bg-primary/5">
                    <TableCell className="font-bold text-foreground">{p.name}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{p.dist}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{p.star}</TableCell>
                    <TableCell className="text-primary font-mono font-bold">{p.hzIndex}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{p.temp}</TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground text-[10px] leading-relaxed italic">{p.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
         </Card>
      </div>

      <div className="mt-16 p-8 bg-primary/5 border-2 border-primary rounded-[2.5rem] relative overflow-hidden shadow-[0_0_30px_rgba(228,54,54,0.1)]">
         <div className="absolute -top-12 -right-12 opacity-5 pointer-events-none">
            <Zap className="w-64 h-64 text-primary" />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
               <Info className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2 text-center md:text-left">
               <h3 className="font-headline text-2xl font-bold">Earth Similarity Index (ESI)</h3>
               <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                 The Earth Similarity Index is a multiparameter characterization of exoplanets as a number between 0 (no similarity) and 1 (perfect Earth-like). It takes into account radius, density, escape velocity, and surface temperature. An ESI &gt; 0.8 is generally considered high-potential for habitability.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}