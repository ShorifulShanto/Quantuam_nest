
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Star, Telescope, Info, Map as MapIcon, Compass, Loader2, Target } from "lucide-react";

const constellations = [
  { 
    name: "Ursa Major", 
    aka: "Great Bear", 
    stars: "Dubhe, Merak, Phecda, Megrez", 
    details: "Contains the Big Dipper asterism, one of the most recognizable patterns in the night sky. Used for celestial navigation for centuries.",
    hemisphere: "Northern",
    myth: "Greek: Callisto, a wood nymph transformed into a bear by Zeus to protect her from Hera's wrath.",
    visible: "All Year (Northern Hemisphere)"
  },
  { 
    name: "Orion", 
    aka: "The Hunter", 
    stars: "Betelgeuse, Rigel, Bellatrix, Saiph", 
    details: "Famous for 'Orion's Belt', a straight line of three bright stars. Home to the great Orion Nebula.",
    hemisphere: "Equatorial",
    myth: "Greek: A great hunter who was placed among the stars by Zeus after being killed by a giant scorpion.",
    visible: "Winter (Northern Hemisphere)"
  },
  { 
    name: "Cassiopeia", 
    aka: "The Seated Queen", 
    stars: "Schedar, Caph, Gamma Cassiopeiae", 
    details: "Easily recognized by its distinctive 'W' shape formed by five bright stars.",
    hemisphere: "Northern",
    myth: "Greek: A vain queen who boasted about her beauty, punished by being chained to her throne in the sky.",
    visible: "All Year (Northern Hemisphere)"
  },
  { 
    name: "Crux", 
    aka: "Southern Cross", 
    stars: "Acrux, Mimosa, Gacrux", 
    details: "The smallest of the 88 modern constellations, but one of the most distinctive in the southern sky.",
    hemisphere: "Southern",
    myth: "Aboriginal/Inca: Represents a sacred bird or the eye of a great llama in the dark cloud nebula.",
    visible: "All Year (Southern Hemisphere)"
  },
  { 
    name: "Leo", 
    aka: "The Lion", 
    stars: "Regulus, Denebola, Algieba", 
    details: "One of the earliest recognized constellations. Home to many bright galaxies in the Leo Cluster.",
    hemisphere: "Equatorial",
    myth: "Greek: The Nemean Lion killed by Hercules as the first of his twelve labors.",
    visible: "Spring (Northern Hemisphere)"
  },
  { 
    name: "Scorpius", 
    aka: "The Scorpion", 
    stars: "Antares, Shaula, Sargas", 
    details: "Contains the red supergiant Antares, the 'Heart of the Scorpion'.",
    hemisphere: "Southern/Equatorial",
    myth: "Greek: The scorpion sent by Gaia to kill Orion the hunter.",
    visible: "Summer (Northern Hemisphere)"
  }
];

export default function StarPatternsPage() {
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
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-12 text-foreground">
      <div className="max-w-3xl mb-12 animate-in fade-in duration-700">
        <h1 className="font-headline text-5xl font-bold mb-4 flex items-center gap-4">
          <Sparkles className="text-primary w-10 h-10" /> Star Patterns
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Explore the major constellations, their stellar components, and the deep mythologies that have guided humanity across the oceans and centuries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="font-headline text-2xl font-bold flex items-center gap-3">
             <MapIcon className="text-primary w-6 h-6" /> Celestial Atlas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {constellations.map((constellation) => (
              <Card key={constellation.name} className="bg-card/95 border-2 border-primary hover:bg-white/5 transition-all overflow-hidden group rounded-2xl shadow-[0_0_20px_rgba(228,54,54,0.1)]">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="font-headline text-xl flex items-center gap-2 group-hover:text-primary transition-colors">
                         <Star className="w-4 h-4 text-primary" /> {constellation.name}
                      </CardTitle>
                      <CardDescription className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">
                        {constellation.aka}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[9px] uppercase tracking-widest">
                       {constellation.hemisphere}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-foreground leading-relaxed">
                    {constellation.details}
                  </p>
                  <div className="space-y-2 pt-4 border-t border-border/20">
                     <div className="flex items-start gap-2 text-[10px]">
                        <Telescope className="w-3.5 h-3.5 text-primary shrink-0" /> 
                        <span className="text-muted-foreground"><strong className="text-primary uppercase tracking-widest">Stars:</strong> {constellation.stars}</span>
                     </div>
                     <div className="flex items-start gap-2 text-[10px]">
                        <Info className="w-3.5 h-3.5 text-primary shrink-0" /> 
                        <span className="text-muted-foreground"><strong className="text-primary uppercase tracking-widest">Mythology:</strong> {constellation.myth}</span>
                     </div>
                     <div className="flex items-start gap-2 text-[10px]">
                        <Target className="w-3.5 h-3.5 text-primary shrink-0" /> 
                        <span className="text-muted-foreground"><strong className="text-primary uppercase tracking-widest">Visibility:</strong> {constellation.visible}</span>
                     </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
           <Card className="bg-card/95 border-2 border-primary p-8 rounded-[2rem] relative overflow-hidden h-full flex flex-col justify-center">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                 <Compass className="w-48 h-48 rotate-45" />
              </div>
              <div className="relative z-10 space-y-8">
                <h3 className="font-headline text-3xl font-bold text-primary">Stargazing Protocol</h3>
                <div className="space-y-6">
                  {[
                    { title: "Dark Sky Sites", desc: "Find locations with minimal light pollution for optimal visibility." },
                    { title: "Averted Vision", desc: "Look slightly to the side of faint objects to use the more sensitive parts of your eye." },
                    { title: "Red Light Only", desc: "Use red-filtered flashlights to maintain your night vision adaptation." },
                    { title: "Star Charts", desc: "Use a planisphere or app to identify patterns relative to your current time and location." }
                  ].map((tip, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold shrink-0">{i+1}</div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground mb-1">{tip.title}</h4>
                        <p className="text-xs text-muted-foreground">{tip.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
