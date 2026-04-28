
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  Moon, 
  Rocket, 
  Mountain,
  Layers,
  Loader2,
  Thermometer,
  Weight,
  LayoutGrid,
  Globe
} from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

const solarData = [
  { 
    id: "sun-view",
    name: "Sun", 
    type: "Star", 
    dist: "0 km", 
    gravity: "274 m/s²", 
    temp: "5,500°C", 
    details: "The heart of our system, accounting for 99.8% of its total mass. It's a G-type main-sequence star.",
    surface: "Composed mostly of hydrogen and helium, the Sun's 'surface' (photosphere) is a roiling sea of plasma.",
    atmosphere: "Consists of the chromosphere and the corona, which extends millions of kilometers into space.",
    moons: 0,
    moonList: [],
    discovery: "Known since antiquity."
  },
  { 
    id: "mercury-view",
    name: "Mercury", 
    type: "Terrestrial", 
    dist: "57.9m km", 
    gravity: "3.7 m/s²", 
    temp: "-173 to 427°C",
    atmosphere: "Thin exosphere.", 
    day: "58.6 days", 
    moons: 0,
    moonList: [],
    details: "The smallest and innermost planet. It has no moons and a heavily cratered surface.",
    surface: "Rock and metal composition. Heavily cratered.",
    discovery: "Known since antiquity."
  },
  { 
    id: "venus-view",
    name: "Venus", 
    type: "Terrestrial", 
    dist: "108.2m km", 
    gravity: "8.87 m/s²", 
    temp: "464°C",
    atmosphere: "Thick CO2 (96%).", 
    day: "243 days", 
    moons: 0,
    moonList: [],
    details: "The hottest planet in our solar system due to a runaway greenhouse effect.",
    surface: "Volcanic plains and highlands.",
    discovery: "Known since antiquity."
  },
  { 
    id: "earth-view",
    name: "Earth", 
    type: "Terrestrial", 
    dist: "149.6m km", 
    gravity: "9.81 m/s²", 
    temp: "15°C",
    atmosphere: "Nitrogen (78%), Oxygen (21%).", 
    day: "24 hours", 
    moons: 1,
    moonList: [{ name: "The Moon", details: "Earth's only natural satellite." }],
    details: "Our home. The only planet known to support life, with 70% of its surface covered in water.",
    surface: "Dynamic crust with continents and oceans.",
    discovery: "Known since antiquity."
  },
  { 
    id: "mars-view",
    name: "Mars", 
    type: "Terrestrial", 
    dist: "227.9m km", 
    gravity: "3.72 m/s²", 
    temp: "-65°C",
    atmosphere: "Thin CO2 (95%).", 
    day: "24.6 hours", 
    moons: 2,
    moonList: [{ name: "Phobos", details: "Larger moon." }, { name: "Deimos", details: "Smaller moon." }],
    details: "The Red Planet. Home to Olympus Mons, the largest volcano in the solar system.",
    surface: "Iron-rich dust giving a reddish hue.",
    discovery: "Known since antiquity."
  },
  {
    id: "ceres-view",
    name: "Ceres",
    type: "Dwarf Planet",
    dist: "413.7m km",
    gravity: "0.27 m/s²",
    temp: "-105°C",
    atmosphere: "Transient vapor.",
    day: "9 hours",
    moons: 0,
    moonList: [],
    details: "The largest object in the asteroid belt and the only dwarf planet in the inner solar system.",
    surface: "A mixture of water ice and various hydrated minerals such as carbonates and clay.",
    discovery: "Giuseppe Piazzi (1801)."
  },
  { 
    id: "jupiter-view",
    name: "Jupiter", 
    type: "Gas Giant", 
    dist: "778.6m km", 
    gravity: "24.79 m/s²", 
    temp: "-110°C",
    atmosphere: "Hydrogen, Helium.", 
    day: "9.9 hours", 
    moons: 95,
    moonList: [{ name: "Europa", details: "Icy crust with subsurface ocean." }],
    details: "The largest planet. Its Great Red Spot is a giant storm larger than Earth.",
    surface: "No solid surface; liquid hydrogen.",
    discovery: "Known since antiquity."
  },
  { 
    id: "saturn-view",
    name: "Saturn", 
    type: "Gas Giant", 
    dist: "1.43b km", 
    gravity: "10.44 m/s²", 
    temp: "-140°C",
    atmosphere: "Hydrogen, Helium.", 
    day: "10.7 hours", 
    moons: 146,
    moonList: [{ name: "Titan", details: "Largest moon with thick atmosphere." }],
    details: "Famous for its spectacular ring system made of billions of ice and rock particles.",
    surface: "Gas giant with massive rings.",
    discovery: "Known since antiquity."
  },
  { 
    id: "uranus-view",
    name: "Uranus", 
    type: "Ice Giant", 
    dist: "2.87b km", 
    gravity: "8.69 m/s²", 
    temp: "-195°C",
    atmosphere: "Hydrogen, Helium, Methane.", 
    day: "17.2 hours", 
    moons: 27,
    moonList: [],
    details: "An ice giant that rotates on its side, likely due to a massive collision.",
    surface: "Hot, dense fluid of 'icy' materials.",
    discovery: "William Herschel (1781)."
  },
  { 
    id: "neptune-view",
    name: "Neptune", 
    type: "Ice Giant", 
    dist: "4.50b km", 
    gravity: "11.15 m/s²", 
    temp: "-201°C",
    atmosphere: "Hydrogen, Helium, Methane.", 
    day: "16.1 hours", 
    moons: 14,
    moonList: [],
    details: "The farthest major planet. Strongest winds in the solar system reaching 2,100 km/h.",
    surface: "Slush of water, ammonia, and methane.",
    discovery: "Urbain Le Verrier (1846)."
  },
  {
    id: "pluto-view",
    name: "Pluto",
    type: "Dwarf Planet",
    dist: "5.91b km",
    gravity: "0.62 m/s²",
    temp: "-225°C",
    atmosphere: "Nitrogen, Methane.",
    day: "153 hours",
    moons: 5,
    moonList: [{ name: "Charon", details: "Pluto's largest moon, half its size." }],
    details: "Dwarf planet in the Kuiper Belt with a heart-shaped glacier named Tombaugh Regio.",
    surface: "Mountains of water ice and plains of frozen navigation and methane.",
    discovery: "Clyde Tombaugh (1930)."
  },
  {
    id: "haumea-view",
    name: "Haumea",
    type: "Dwarf Planet",
    dist: "6.45b km",
    gravity: "0.40 m/s²",
    temp: "-241°C",
    atmosphere: "None detected.",
    day: "3.9 hours",
    moons: 2,
    moonList: [{ name: "Hi'iaka", details: "Outer larger moon." }, { name: "Namaka", details: "Inner smaller moon." }],
    details: "A fast-rotating, football-shaped dwarf planet in the Kuiper Belt.",
    surface: "Crystalline water ice.",
    discovery: "Mike Brown et al. (2004)."
  },
  {
    id: "makemake-view",
    name: "Makemake",
    type: "Dwarf Planet",
    dist: "6.85b km",
    gravity: "0.50 m/s²",
    temp: "-239°C",
    atmosphere: "Transient methane.",
    day: "22.5 hours",
    moons: 1,
    moonList: [{ name: "MK 2", details: "Small dark moon." }],
    details: "One of the largest objects in the Kuiper Belt, named after the Rapa Nui creator god.",
    surface: "Frozen methane and ethane.",
    discovery: "Mike Brown et al. (2005)."
  },
  {
    id: "eris-view",
    name: "Eris",
    type: "Dwarf Planet",
    dist: "10.12b km",
    gravity: "0.82 m/s²",
    temp: "-231°C",
    atmosphere: "Frozen methane.",
    day: "25.9 hours",
    moons: 1,
    moonList: [{ name: "Dysnomia", details: "Only known moon." }],
    details: "Once thought to be larger than Pluto, its discovery led to the reclassification of planets.",
    surface: "Layer of methane ice.",
    discovery: "Mike Brown et al. (2005)."
  },
  {
    id: "sedna-view",
    name: "Sedna",
    type: "TNO",
    dist: "12.9b km",
    gravity: "0.33 m/s²",
    temp: "-240°C",
    atmosphere: "Unknown.",
    day: "10 hours",
    moons: 0,
    moonList: [],
    details: "One of the most distant known objects in our solar system, with a highly elliptical orbit.",
    surface: "Reddish hue, likely from organic tholins.",
    discovery: "Mike Brown et al. (2003)."
  }
];

export default function SolarSystemPage() {
  const [viewMode, setViewMode] = useState<"grid" | "interactive">("interactive");
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const getPlanetImage = (id: string) => {
    return PlaceHolderImages.find(img => img.id === id) || PlaceHolderImages[0];
  };

  const MissionDetails = ({ body, img }: { body: typeof solarData[0], img: any }) => (
    <DialogContent className="max-w-4xl bg-card border-border max-h-[90vh] overflow-y-auto rounded-[2rem] p-6 md:p-10">
      <DialogHeader className="mb-8">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 rounded-full relative overflow-hidden border border-border/40">
              <Image src={img.imageUrl} alt={body.name} fill className="object-cover" unoptimized />
           </div>
           <div className="text-left">
              <DialogTitle className="font-headline text-4xl text-foreground font-bold leading-none">{body.name}</DialogTitle>
              <DialogDescription className="text-accent font-bold uppercase tracking-[0.2em] mt-2 text-[10px]">Body Archive</DialogDescription>
           </div>
        </div>
      </DialogHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
               <Card className="bg-background/50 border-border/40 p-4 rounded-2xl shadow-sm">
                  <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mb-1 flex items-center gap-1.5"><Weight className="w-3 h-3 text-primary"/> Gravity</p>
                  <p className="font-headline font-bold text-xl text-foreground">{body.gravity}</p>
               </Card>
               <Card className="bg-background/50 border-border/40 p-4 rounded-2xl shadow-sm">
                  <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mb-1 flex items-center gap-1.5"><Thermometer className="w-3 h-3 text-primary"/> Temperature</p>
                  <p className="font-headline font-bold text-xl text-foreground">{body.temp}</p>
               </Card>
            </div>

            {body.moonList.length > 0 && (
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                   <Moon className="w-3.5 h-3.5" /> Natural Satellites
                </h4>
                <div className="space-y-2">
                  {body.moonList.map((moon, idx) => (
                    <div key={idx} className="p-4 bg-background/50 rounded-2xl border border-border/40">
                      <p className="text-xs font-bold text-foreground mb-1">{moon.name}</p>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">{moon.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
         </div>

         <div className="space-y-6">
            <div className="space-y-2">
               <h4 className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                  <Mountain className="w-3.5 h-3.5" /> Geology
               </h4>
               <p className="text-[11px] text-muted-foreground leading-relaxed">{body.surface || "Analysis pending."}</p>
            </div>

            <div className="space-y-2">
               <h4 className="flex items-center gap-2 text-[10px] font-bold text-accent uppercase tracking-[0.2em]">
                  <Layers className="w-3.5 h-3.5" /> Atmosphere
               </h4>
               <p className="text-[11px] text-muted-foreground leading-relaxed">{body.atmosphere}</p>
            </div>

            <div className="pt-4">
              <Button asChild className="w-full h-12 rounded-xl transition-all font-bold uppercase tracking-widest text-[9px]">
                <a href={`https://images.nasa.gov/search?q=${body.name}&media_type=video`} target="_blank" rel="noopener noreferrer">
                  <Rocket className="w-3.5 h-3.5 mr-2" /> NASA Visual Archives
                </a>
              </Button>
            </div>
         </div>
      </div>
    </DialogContent>
  );

  return (
    <div className="min-h-screen bg-[#EBE5C9] text-foreground transition-colors duration-500">
      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center animate-fade-in-up">
           <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-primary font-bold tracking-[0.2em] text-[9px] uppercase">Planetary Archives</span>
          </div>
          <h1 className="font-headline text-4xl md:text-6xl font-bold text-foreground tracking-tight mb-4 drop-shadow-sm">
            Solar System Exploration
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto leading-relaxed">
            A comprehensive gateway to the celestial bodies within our solar system. Access high-fidelity 3D visualization or browse our archival planetary datasets.
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <div className="bg-card/50 backdrop-blur-sm p-1 rounded-full border border-border flex gap-1 shadow-sm">
            <Button 
              variant={viewMode === "interactive" ? "default" : "ghost"} 
              size="sm"
              onClick={() => setViewMode("interactive")}
              className="rounded-full px-6 h-10 text-[10px] font-bold tracking-widest uppercase"
            >
              <Globe className="w-4 h-4 mr-2" /> 3D Eyes
            </Button>
            <Button 
              variant={viewMode === "grid" ? "default" : "ghost"} 
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-full px-6 h-10 text-[10px] font-bold tracking-widest uppercase"
            >
              <LayoutGrid className="w-4 h-4 mr-2" /> Grid Archives
            </Button>
          </div>
        </div>

        {viewMode === "interactive" && (
          <section className="animate-in fade-in duration-500 h-[calc(100vh-350px)] min-h-[500px]">
            <div className="w-full h-full rounded-[2.5rem] overflow-hidden border border-border bg-black shadow-lg relative">
              <iframe 
                src="https://eyes.nasa.gov/apps/solar-system/#/home" 
                className="w-full h-full border-none"
                allowFullScreen
              />
            </div>
          </section>
        )}

        {viewMode === "grid" && (
          <section className="py-8 animate-in fade-in zoom-in duration-500 pb-24">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {solarData.map((body) => {
                const img = getPlanetImage(body.id);
                return (
                  <Dialog key={body.id}>
                    <DialogTrigger asChild>
                      <Card className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer group rounded-[2rem] overflow-hidden h-full shadow-md hover:shadow-xl">
                        <div className="aspect-square relative overflow-hidden">
                          <Image src={img.imageUrl} alt={body.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" unoptimized />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <div className="absolute bottom-4 left-4 text-left">
                            <p className="text-[8px] font-bold text-accent uppercase tracking-[0.3em] mb-1">{body.type}</p>
                            <p className="text-xl font-headline font-bold leading-tight tracking-tight text-white">{body.name}</p>
                          </div>
                        </div>
                      </Card>
                    </DialogTrigger>
                    <MissionDetails body={body} img={img} />
                  </Dialog>
                )
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
