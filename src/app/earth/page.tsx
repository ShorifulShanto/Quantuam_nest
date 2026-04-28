
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Thermometer, Wind, Droplets, Shield, Mountain, Loader2 } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function EarthPage() {
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

  const earthImg = PlaceHolderImages.find(img => img.id === "earth-view") || PlaceHolderImages[0] || {
    imageUrl: "https://picsum.photos/seed/earth/1200/800",
    description: "Earth",
    imageHint: "earth"
  };

  return (
    <div className="container mx-auto px-4 py-12 pb-24 md:pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div className="relative aspect-square rounded-full overflow-hidden border-4 border-primary/20 shadow-[0_0_50px_rgba(46,204,113,0.15)] animate-in fade-in zoom-in duration-1000">
          <Image
            src={earthImg.imageUrl}
            alt={earthImg.description}
            fill
            className="object-cover"
            data-ai-hint={earthImg.imageHint}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
        </div>
        
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-700">
          <div>
            <h2 className="font-headline text-accent text-sm font-bold tracking-widest uppercase mb-2">The Blue Marble</h2>
            <h1 className="font-headline text-5xl font-bold mb-6">Earth Insights</h1>
            <p className="text-lg text-muted-foreground">
              Earth is the third planet from the Sun and the only astronomical object known to harbor life. It is the densest planet in the Solar System and the largest of the four terrestrial planets.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <Card className="bg-card/20 border-border/40 shadow-lg">
                <CardHeader className="pb-2">
                  <Thermometer className="w-5 h-5 text-accent mb-2" />
                  <CardTitle className="text-sm font-medium">Global Average</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">14.9°C</div>
                  <p className="text-xs text-muted-foreground">Steady thermal regulation</p>
                </CardContent>
             </Card>
             <Card className="bg-card/20 border-border/40 shadow-lg">
                <CardHeader className="pb-2">
                  <Shield className="w-5 h-5 text-primary mb-2" />
                  <CardTitle className="text-sm font-medium">Magnetic Shield</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Active</div>
                  <p className="text-xs text-muted-foreground">Protecting the biosphere</p>
                </CardContent>
             </Card>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="bg-card/40 border-border/60 hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Wind className="text-primary" /> Atmospheric Composition
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Nitrogen (N₂)</span>
                <span>78.08%</span>
              </div>
              <Progress value={78} className="bg-secondary h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Oxygen (O₂)</span>
                <span>20.95%</span>
              </div>
              <Progress value={21} className="bg-secondary h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-muted-foreground">
                <span>Argon & Trace</span>
                <span>0.97%</span>
              </div>
              <Progress value={1} className="bg-secondary h-2" />
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              The atmosphere protects us from UV radiation and regulates surface temperature via the greenhouse effect.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-border/60 hover:border-accent/50 transition-colors">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Droplets className="text-accent" /> Hydrosphere Facts
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-4xl font-bold mb-2">70.8%</div>
             <p className="text-muted-foreground mb-4">Surface area covered by water.</p>
             <div className="h-24 rounded-lg bg-gradient-to-r from-blue-900 via-accent/30 to-blue-500 overflow-hidden relative shadow-inner">
                <div className="absolute inset-0 opacity-20 flex flex-wrap gap-2 p-2">
                   {Array.from({length: 20}).map((_, i) => (
                     <div key={i} className="w-1 h-1 bg-white rounded-full animate-pulse" />
                   ))}
                </div>
             </div>
             <div className="mt-4 space-y-2">
               <div className="flex justify-between text-xs">
                 <span>Saltwater (Oceans)</span>
                 <span className="font-bold">96.5%</span>
               </div>
               <div className="flex justify-between text-xs">
                 <span>Freshwater (Ice/Ground)</span>
                 <span className="font-bold">3.5%</span>
               </div>
             </div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-border/60 hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Mountain className="text-primary" /> Geosphere
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Earth's interior is active, with a solid iron inner core and a liquid outer core that generates our magnetic field.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-primary/5 border border-primary/10">
                <p className="text-muted-foreground uppercase font-bold text-[8px]">Age</p>
                <p className="font-bold">4.54 Billion Years</p>
              </div>
              <div className="p-2 rounded bg-primary/5 border border-primary/10">
                <p className="text-muted-foreground uppercase font-bold text-[8px]">Tilt</p>
                <p className="font-bold">23.44°</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
