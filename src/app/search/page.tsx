"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, 
  Loader2, 
  AlertTriangle, 
  Zap, 
  Calendar,
  Sparkles,
  Info,
  Image as ImageIcon,
  Star,
  Globe,
  Volume2,
  Video,
  FileText
} from "lucide-react";
import { cosmicSearch } from "@/ai/flows/cosmic-search-flow";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResults(null);
    
    try {
      const data = await cosmicSearch(query);
      setResults(data);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Mission Interrupted",
        description: "Archive data retrieval failed. Please check your credentials.",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (!results || !results.success) return null;

    const { type, data, info } = results;

    return (
      <div className="space-y-12">
        {/* --- AI INTELLIGENCE SUMMARY --- */}
        {(info || type === 'explanation') && (
          <Card className="bg-accent/10 border-accent/30 p-8 rounded-[2.5rem] relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-lg">
            <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
              <Sparkles className="w-48 h-48 text-accent" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                 <Badge className="bg-accent text-accent-foreground font-bold uppercase tracking-widest text-[10px] px-4 py-1.5 shadow-sm">Explorer Intelligence</Badge>
              </div>
              <h2 className="font-headline text-3xl font-bold text-foreground mb-4 drop-shadow-sm">Deep Space Analysis</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-foreground font-medium leading-relaxed whitespace-pre-wrap">
                  {info || (type === 'explanation' ? data : '')}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* --- DYNAMIC DATA RENDERING --- */}
        {type === 'asteroids' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-primary w-8 h-8 drop-shadow-[0_0_8px_rgba(228,54,54,0.5)]" />
              <h2 className="font-headline text-2xl font-bold text-foreground">Asteroid Tracker (NeoWs)</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.map((a: any) => (
                <Card key={a.id || Math.random()} className="bg-card border-primary/20 hover:border-primary/50 transition-all shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-headline font-bold text-foreground">{a.name}</CardTitle>
                      {a.hazardous && <Badge variant="destructive" className="animate-pulse shadow-sm">Hazardous</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p className="flex justify-between text-foreground/70 font-medium"><span>Relative Speed:</span> <span className="font-mono text-primary font-bold">{a.speed}</span></p>
                    <p className="flex justify-between text-foreground/70 font-medium"><span>Miss Distance:</span> <span className="font-mono text-primary font-bold">{a.distance}</span></p>
                    <p className="flex justify-between text-foreground/70 font-medium"><span>Est. Diameter:</span> <span className="font-mono text-primary font-bold">{a.size}</span></p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {type === 'space_weather' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="text-primary w-8 h-8 drop-shadow-[0_0_8px_rgba(228,54,54,0.5)]" />
              <h2 className="font-headline text-2xl font-bold text-foreground">Space Weather Notifications</h2>
            </div>
            <div className="space-y-4">
              {data.map((w: any, i: number) => (
                <Card key={i} className="bg-white/50 border-primary/30 shadow-sm">
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <Badge variant="outline" className="text-primary border-primary/40 uppercase tracking-widest font-bold bg-primary/5">{w.type}</Badge>
                      <span className="text-[10px] text-foreground font-mono font-bold">{w.date}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground font-medium">{w.message}</p>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}

        {type === 'apod' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-card border-primary/20 overflow-hidden shadow-2xl rounded-2xl">
              <div className="relative aspect-video">
                <Image src={data.url} alt={data.title} fill className="object-cover" unoptimized />
              </div>
            </Card>
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-[11px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full w-fit">
                <Calendar className="w-3.5 h-3.5" /> {data.date} • NASA APOD
              </div>
              <h2 className="font-headline text-3xl font-bold text-foreground drop-shadow-sm">{data.title}</h2>
              <p className="text-base text-foreground/80 leading-relaxed font-medium">{data.explanation}</p>
            </div>
          </div>
        )}

        {(type.includes('images') || type.includes('audio') || type.includes('video')) && (
          <div className="space-y-8">
            <h2 className="font-headline text-2xl font-bold flex items-center gap-3 text-foreground">
              {type.includes('audio') ? <Volume2 className="text-primary" /> : type.includes('video') ? <Video className="text-primary" /> : <ImageIcon className="text-primary" />}
              {type.includes('nasa') ? 'NASA Discovery Archive' : 'Pexels Visual Gallery'}
            </h2>
            <div className="grid grid-cols-1 gap-8">
              {data.map((item: any, i: number) => (
                <Card key={i} className="bg-card border-primary/20 overflow-hidden group hover:border-primary/50 transition-all rounded-[2rem] shadow-md">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                    <div className="lg:col-span-1 relative aspect-square rounded-xl overflow-hidden shadow-lg border border-primary/10">
                      {item.image ? (
                        <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" unoptimized />
                      ) : (
                        <div className="w-full h-full bg-muted flex flex-col items-center justify-center text-center p-4">
                          {type.includes('audio') ? <Volume2 className="w-12 h-12 mb-2 text-primary" /> : <ImageIcon className="w-12 h-12 mb-2 text-primary" />}
                          <p className="text-[10px] uppercase tracking-widest opacity-70 font-bold">Audio Stream Only</p>
                        </div>
                      )}
                    </div>
                    <div className="lg:col-span-2 space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="border-primary/30 text-primary text-[9px] tracking-[0.2em] uppercase font-bold bg-primary/5">Archive Record</Badge>
                        <span className="text-[10px] text-foreground font-mono font-bold bg-white/40 px-2 py-0.5 rounded-sm">{item.date?.split('T')[0]}</span>
                      </div>
                      <h3 className="font-headline text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                      <div className="space-y-4">
                        <div className="flex gap-2 items-start">
                          <FileText className="w-4.5 h-4.5 text-primary mt-1 shrink-0" />
                          <p className="text-sm text-foreground/80 font-medium leading-relaxed whitespace-pre-wrap">
                            {item.description || "No archival text available for this specific artifact."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 pb-24 lg:pb-8">
      <div className="max-w-3xl mx-auto mb-12 text-center animate-in fade-in duration-700">
        <h1 className="font-headline text-5xl font-bold mb-4 flex items-center justify-center gap-4 text-foreground drop-shadow-sm">
          <Search className="text-primary w-10 h-10" /> Cosmic Search
        </h1>
        <p className="text-foreground/80 text-base font-medium">
          Query the archives for <span className="text-primary font-bold drop-shadow-[0_0_8px_rgba(228,54,54,0.3)]">asteroids</span>, <span className="text-primary font-bold drop-shadow-[0_0_8px_rgba(228,54,54,0.3)]">solar flares</span>, or specific <span className="text-primary font-bold drop-shadow-[0_0_8px_rgba(228,54,54,0.3)]">celestial bodies</span>.
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-16">
        <form onSubmit={handleSearch} className="relative flex gap-3">
          <Input
            placeholder="Search e.g., 'Black Hole', 'Voyager 1', 'Asteroids'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-full bg-white/60 border-primary/30 pl-8 h-14 text-foreground text-lg font-medium focus:ring-primary shadow-inner"
          />
          <Button 
            type="submit" 
            disabled={loading}
            className="rounded-full bg-primary text-white px-10 h-14 font-bold text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(228,54,54,0.4)]"
          >
            {loading ? <Loader2 className="animate-spin" /> : "SCAN ARCHIVES"}
          </Button>
        </form>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-6">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="font-headline text-base font-bold tracking-[0.2em] text-primary animate-pulse uppercase">
            Syncing with Deep Space Intelligence Network...
          </p>
        </div>
      )}

      <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
        {renderResult()}
      </div>

      {!results && !loading && (
        <div className="flex flex-col items-center justify-center py-24 opacity-40">
          <Globe className="w-20 h-20 mb-6 animate-orbit text-primary" />
          <p className="text-xs font-bold uppercase tracking-[0.5em] text-foreground">System Awaiting Command</p>
        </div>
      )}
    </div>
  );
}
