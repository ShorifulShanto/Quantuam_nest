"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Volume2, Play, Pause, Download, Radio, Loader2, Sparkles, Star, Zap, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SpaceSound {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  date: string;
  category: "Black Hole" | "Planetary" | "Star" | "Sonification";
}

export default function SpaceSoundsPage() {
  const { user, isUserLoading } = useUser();
  const [sounds, setSounds] = useState<SpaceSound[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
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

  useEffect(() => {
    async function fetchSounds() {
      setLoading(true);
      try {
        // Query specifically for "sonification" which are real data-to-sound translations
        // NOT podcasts or interviews.
        const queries = ["sonification", "black hole sonification", "pulsar audio", "planetary radio waves"];
        const results: SpaceSound[] = [];

        for (const q of queries) {
          const res = await fetch(`https://images-api.nasa.gov/search?q=${encodeURIComponent(q)}&media_type=audio`);
          const data = await res.json();
          // Filter out items containing "podcast" or "interview" in title
          const items = (data.collection.items || []).filter((item: any) => {
            const title = item.data[0].title.toLowerCase();
            return !title.includes("podcast") && !title.includes("interview") && !title.includes("episode");
          }).slice(0, 4);
          
          for (const item of items) {
            const manifestRes = await fetch(item.href);
            const manifestData = await manifestRes.json();
            const audioUrl = manifestData.find((url: string) => url.endsWith('~orig.mp3') || url.endsWith('.mp3'));
            
            if (audioUrl) {
              results.push({
                id: item.data[0].nasa_id,
                title: item.data[0].title,
                description: item.data[0].description,
                audioUrl,
                date: item.data[0].date_created,
                category: q.includes("black hole") ? "Black Hole" : q.includes("sonification") ? "Sonification" : "Planetary"
              });
            }
          }
        }

        // Deduplicate
        const uniqueSounds = Array.from(new Map(results.map(item => [item.id, item])).values());
        setSounds(uniqueSounds);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Archive Error",
          description: "Could not retrieve space audio artifacts.",
        });
      } finally {
        setLoading(false);
      }
    }

    if (user) fetchSounds();
  }, [user, toast]);

  const togglePlay = (id: string) => {
    const audio = document.getElementById(`audio-${id}`) as HTMLAudioElement;
    if (playingId === id) {
      audio.pause();
      setPlayingId(null);
    } else {
      if (playingId) {
        const prevAudio = document.getElementById(`audio-${playingId}`) as HTMLAudioElement;
        prevAudio.pause();
      }
      audio.play();
      setPlayingId(id);
    }
  };

  if (isUserLoading || (loading && !sounds.length)) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-12 w-64 mb-8 bg-card/40" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl bg-card/40" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12 pb-24 md:pb-12">
      <div className="max-w-3xl mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="flex items-center gap-3 mb-4">
           <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
             <Volume2 className="w-8 h-8 text-accent animate-pulse" />
           </div>
           <h1 className="font-headline text-5xl font-bold">Sonic Observatory</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Listen to raw cosmic data translated into sound. This portal features <span className="text-accent font-bold">NASA Sonifications</span>—the audible frequency of gravity, magnetism, and light.
        </p>
      </div>

      {sounds.length === 0 ? (
        <div className="py-24 text-center">
           <p className="text-muted-foreground font-headline uppercase tracking-widest animate-pulse">Scanning Archive for Artifacts...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sounds.map((sound) => (
            <Card key={sound.id} className="bg-card/20 border-border/40 hover:border-accent/40 transition-all group overflow-hidden flex flex-col relative rounded-[1.5rem]">
              {sound.category === "Black Hole" && (
                <div className="absolute top-0 right-0 p-3">
                  <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 text-[8px] uppercase tracking-widest font-bold">
                    Sonification
                  </Badge>
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-sm font-bold font-headline line-clamp-1 group-hover:text-accent transition-colors">
                      {sound.title}
                    </CardTitle>
                    <CardDescription className="text-[10px] uppercase tracking-widest font-bold text-accent/60">
                      Archive Artifact • {new Date(sound.date).getFullYear()}
                    </CardDescription>
                  </div>
                  <div className="bg-accent/10 p-1.5 rounded-full border border-accent/20 shrink-0">
                    <Radio className="w-3.5 h-3.5 text-accent" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <p className="text-[11px] text-muted-foreground line-clamp-4 leading-relaxed font-medium">
                  {sound.description}
                </p>
                
                <div className="pt-2 space-y-3">
                  <audio 
                    id={`audio-${sound.id}`} 
                    src={sound.audioUrl} 
                    onEnded={() => setPlayingId(null)}
                    className="hidden"
                  />
                  
                  <div className="flex items-center gap-2">
                      <Button 
                        onClick={() => togglePlay(sound.id)}
                        className="flex-grow bg-accent text-accent-foreground font-bold rounded-xl h-12 text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-transform"
                      >
                        {playingId === sound.id ? (
                          <>
                            <Pause className="w-4 h-4 mr-2" /> STOP STREAM
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" /> INITIATE STREAM
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="rounded-xl h-12 w-12 border-border/40 hover:bg-accent/10"
                        asChild
                      >
                        <a href={sound.audioUrl} download target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4" />
                        </a>
                      </Button>
                  </div>
                  
                  {playingId === sound.id && (
                    <div className="flex justify-center gap-1.5 h-6 items-end pb-1 px-4">
                        {[1,2,3,4,5,6,7,8,9,10].map(i => (
                          <div 
                            key={i} 
                            className="w-1 bg-accent rounded-full animate-bounce" 
                            style={{ 
                              height: `${20 + Math.random() * 80}%`,
                              animationDuration: `${0.3 + Math.random() * 0.7}s`
                            }} 
                          />
                        ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-16 p-8 bg-card/40 border border-border/40 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 opacity-5 pointer-events-none">
           <Zap className="w-64 h-64 text-accent" />
        </div>
        <div className="bg-accent/10 p-6 rounded-[2rem] border border-accent/20 z-10 shrink-0">
           <Sparkles className="w-16 h-16 text-accent" />
        </div>
        <div className="space-y-4 z-10">
           <h3 className="font-headline text-3xl font-bold text-foreground">What is Space Sonification?</h3>
           <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
             Space is a vacuum, so sound waves cannot travel. However, space is filled with electromagnetic radiation, gravitational waves, and high-energy particles. <strong className="text-accent">Sonification</strong> is the process of mapping these non-auditory data points to sound frequencies, allowing us to perceive the complex dynamics of black hole jets or the rotation of pulsars through hearing.
           </p>
           <div className="flex flex-wrap gap-4 pt-4">
              <Badge variant="outline" className="border-accent/30 text-accent uppercase tracking-widest text-[9px] px-3 py-1">
                 <Star className="w-3 h-3 mr-2" /> Data Mapping
              </Badge>
              <Badge variant="outline" className="border-accent/30 text-accent uppercase tracking-widest text-[9px] px-3 py-1">
                 <Zap className="w-3 h-3 mr-2" /> EM Translation
              </Badge>
              <Badge variant="outline" className="border-accent/30 text-accent uppercase tracking-widest text-[9px] px-3 py-1">
                 <Info className="w-3 h-3 mr-2" /> NASA Scientific Data
              </Badge>
           </div>
        </div>
      </div>
    </div>
  );
}