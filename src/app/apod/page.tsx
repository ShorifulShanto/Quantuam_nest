
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Calendar, Info, Share2, ChevronLeft, ChevronRight, AlertCircle, RefreshCcw } from "lucide-react";
import Image from "next/image";
import { useUser } from "@/firebase";

interface ApodData {
  title: string;
  date: string;
  explanation: string;
  url: string;
  media_type: string;
  success?: boolean;
}

// Recalibrated with a more stable mission key
const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || "63X0QfFA81wcRSK5h6W2xQNFOKj3MT5EwRIUOl2T";

export default function ApodPage() {
  const [data, setData] = useState<ApodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<string>("");
  const { user } = useUser();

  useEffect(() => {
    // Mission time synchronization
    setCurrentDate(new Date().toISOString().split('T')[0]);
  }, []);

  async function fetchApod(dateToFetch: string, isRetry: boolean = false) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=${dateToFetch}`);
      
      if (!res.ok) {
        // Handle the case where "today" isn't ready yet (e.g. 404/400 at midnight)
        if (!isRetry) {
          const prevDate = new Date(dateToFetch);
          prevDate.setDate(prevDate.getDate() - 1);
          const formattedPrevDate = prevDate.toISOString().split('T')[0];
          return fetchApod(formattedPrevDate, true);
        }
        
        const errorData = await res.json().catch(() => ({ msg: "Archive unreachable" }));
        throw new Error(errorData.msg || "NASA Mission Protocol Error");
      }
      
      const json = await res.json();
      setData(json);
      // Update the visible date to match what was actually fetched
      if (json.date) setCurrentDate(json.date);
    } catch (err: any) {
      console.error("APOD Archive Error:", err);
      setError(err.message);
      setData({
        title: "Archive Unreachable",
        date: dateToFetch,
        explanation: `The Daily Capture engine encountered a protocol error: "${err.message}". This usually occurs when today's data is not yet indexed or mission credentials have been throttled.`,
        url: "",
        media_type: "error"
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (currentDate) {
      fetchApod(currentDate);
    }
  }, [currentDate]);

  const handlePrevDay = () => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - 1);
    setCurrentDate(date.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const today = new Date().toISOString().split('T')[0];
    if (currentDate === today) return;
    
    const date = new Date(currentDate);
    date.setDate(date.getDate() + 1);
    setCurrentDate(date.toISOString().split('T')[0]);
  };

  const handleRetry = () => {
    if (currentDate) fetchApod(currentDate);
  };

  if (loading || !currentDate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-48 mb-6 bg-card/40" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <Skeleton className="aspect-square w-full rounded-xl bg-card/40" />
           <div className="space-y-4">
              <Skeleton className="h-8 w-full bg-card/40" />
              <Skeleton className="h-4 w-3/4 bg-card/40" />
              <Skeleton className="h-32 w-full bg-card/40" />
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-24 lg:pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="max-w-3xl">
          <h1 className="font-headline text-4xl font-bold mb-2 flex items-center gap-3 text-foreground">
            <Camera className="text-primary" /> Daily Capture
          </h1>
          <p className="text-muted-foreground text-sm">
            Astronomy Picture of the Day (APOD) - Strict NASA Mission Protocol.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-card/20 p-2 rounded-full border-2 border-primary shadow-[0_0_15px_rgba(228,54,54,0.1)]">
           <Button variant="ghost" size="icon" onClick={handlePrevDay} className="rounded-full">
              <ChevronLeft className="w-5 h-5" />
           </Button>
           <span className="text-xs font-bold font-mono px-2">{currentDate}</span>
           <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleNextDay} 
            className="rounded-full"
            disabled={currentDate === new Date().toISOString().split('T')[0]}
           >
              <ChevronRight className="w-5 h-5" />
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-6">
          <Card className="bg-card/30 border-2 border-primary overflow-hidden shadow-2xl rounded-2xl group transition-all hover:shadow-[0_0_30px_rgba(228,54,54,0.15)]">
            {data?.media_type === "image" && data.url ? (
              <div className="relative aspect-square md:aspect-video w-full overflow-hidden">
                <Image
                  src={data.url}
                  alt={data.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ) : data?.media_type === "video" ? (
              <div className="aspect-video bg-muted flex flex-col items-center justify-center p-8 text-center">
                 <Camera className="w-12 h-12 text-primary mb-4 animate-pulse" />
                 <p className="font-headline text-lg text-foreground">Video Stream Detected</p>
                 <Button asChild variant="link" className="text-primary mt-2">
                    <a href={data.url} target="_blank" rel="noopener noreferrer">View Original Mission Video</a>
                 </Button>
              </div>
            ) : (
              <div className="aspect-video bg-destructive/10 border border-destructive/20 flex flex-col items-center justify-center p-8 text-center">
                 <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                 <p className="font-headline text-lg text-destructive">Mission Data Unavailable</p>
                 <p className="text-xs text-muted-foreground mt-2 max-w-xs">{error || "The requested celestial coordinates are not yet available."}</p>
                 <Button onClick={handleRetry} variant="outline" className="mt-4 border-destructive/40 text-destructive hover:bg-destructive/10">
                    <RefreshCcw className="w-4 h-4 mr-2" /> Sync Again
                 </Button>
              </div>
            )}
          </Card>
          
          <div className="flex flex-wrap items-center justify-between gap-4">
             <div className="flex gap-2">
               <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/20 flex gap-1 items-center px-3 py-1">
                  <Calendar className="w-3 h-3" /> {data?.date}
               </Badge>
               <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/20 flex gap-1 items-center px-3 py-1">
                  <Info className="w-3 h-3" /> NASA APOD
               </Badge>
             </div>
             
             {data?.media_type === "image" && (
               <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="rounded-full border-border/40">
                     <Share2 className="w-5 h-5 text-foreground" />
                  </Button>
               </div>
             )}
          </div>
        </div>

        <div className="space-y-6">
           <h2 className="font-headline text-2xl lg:text-3xl font-bold text-foreground">{data?.title}</h2>
           <div className="prose prose-invert max-w-none">
             <p className="text-muted-foreground leading-relaxed">
               {data?.explanation}
             </p>
           </div>
           
           <Card className="bg-primary/5 border-2 border-primary/30 rounded-2xl">
              <CardContent className="p-4 flex gap-4 items-start">
                 <Info className="w-5 h-5 text-primary mt-1 shrink-0" />
                 <p className="text-xs text-muted-foreground">
                   Daily Capture acts as a direct data transformer for the NASA APOD protocol. It ensures archival integrity by bypassing AI summaries for this specific feature.
                 </p>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
