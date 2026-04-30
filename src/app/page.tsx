
"use client";

import { useState, Suspense, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Rocket, Sparkles, Camera, ArrowRight, Search, Info, Loader2, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * FeaturesGrid - Recalibrated mission selection module.
 */
function FeaturesGrid({ onAccess, onPrefetch }: { onAccess: (e: any, h: string) => void, onPrefetch: (h: string) => void }) {
  const features = [
    { name: "Solar System", href: "/solar-system", icon: Rocket, desc: "Planetary and gravity archives." },
    { name: "Star Atlas", href: "/star-patterns", icon: Sparkles, desc: "Constellations and stellar myths." },
    { name: "Space Sounds", href: "/space-sounds", icon: Volume2, desc: "Authentic NASA audio recordings." },
    { name: "Cosmic Search", href: "/search", icon: Search, desc: "NASA archive media search." },
    { name: "Daily Capture", href: "/apod", icon: Camera, desc: "Astronomy Picture of the Day." },
    { name: "Goldilocks", href: "/habitable-zone", icon: Info, desc: "Habitable zone analysis." },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {features.map((feature, idx) => (
        <Link 
          key={feature.href} 
          href={feature.href} 
          onClick={(e) => onAccess(e, feature.href)}
          onMouseEnter={() => onPrefetch(feature.href)}
          prefetch={false}
          className="group"
          style={{ animationDelay: `${idx * 0.1}s` }}
        >
          <Card className="glass-card h-full transition-all duration-500 hover:-translate-y-1 border-2 border-primary rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-card/95 to-card/95 shadow-[0_0_20px_rgba(228,54,54,0.1)] hover:shadow-[0_0_35px_rgba(228,54,54,0.3)] ring-2 ring-primary">
            <CardHeader className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-4 transition-all border border-primary/40 shadow-[0_0_15px_rgba(228,54,54,0.3)]">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="font-headline text-xl text-foreground mb-1 font-bold">{feature.name}</CardTitle>
              <CardDescription className="text-muted-foreground text-sm font-medium leading-relaxed">
                {feature.desc}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-0">
              <div className="flex items-center text-primary font-bold text-xs uppercase tracking-widest gap-2 group-hover:text-[#B82C2C] transition-colors">
                Launch Mission <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default function Home() {
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoUrl = "https://res.cloudinary.com/drmpjeatm/video/upload/v1777228460/15735937-hd_1920_1080_30fps_1_oflmb5.mp4";

  const handleFeatureAccess = (e: React.MouseEvent, href: string) => {
    if (!user) {
      e.preventDefault();
      toast({
        title: "Mission Restricted",
        description: "Please initialize your explorer profile to launch.",
        variant: "destructive",
      });
      router.push('/login');
    }
  };

  const handlePrefetch = (href: string) => {
    router.prefetch(href);
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setIsVideoLoading(false)}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-700",
            isVideoLoading ? 'opacity-0' : 'opacity-100'
          )}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
      </div>
      
      <div className="container relative z-10 mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-3xl mb-16 animate-fade-in-up flex flex-col items-start gap-8">
          <div className="inline-flex items-center gap-2 bg-primary/25 border border-primary/40 px-4 py-1.5 rounded-full shadow-[0_0_30px_rgba(228,54,54,0.8)] backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            <span className="text-primary font-bold tracking-[0.2em] text-[11px] uppercase [-webkit-text-stroke:0.3px_rgba(0,0,0,0.8)]">Mission Protocol Active</span>
          </div>
          
          <h1 className="font-headline text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] drop-shadow-[0_0_40px_rgba(228,54,54,0.9)] [-webkit-text-stroke:1.5px_rgba(0,0,0,0.8)]">
            Quantum Nest <br/> <span className="text-primary drop-shadow-[0_0_45px_rgba(228,54,54,0.95)] [-webkit-text-stroke:1px_rgba(0,0,0,0.6)]">Cosmic Insights</span>
          </h1>

          <p className="text-xl text-[#F7F1D6] leading-relaxed max-w-xl font-medium drop-shadow-[0_0_25px_rgba(0,0,0,0.9)] [-webkit-text-stroke:0.5px_rgba(0,0,0,0.8)]">
            A calm, intelligent gateway to the universe. Explore deep space archives and planetary libraries with refined human warmth.
          </p>
        </div>

        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-48 bg-card/20 rounded-2xl animate-pulse" />)}
          </div>
        }>
          <FeaturesGrid onAccess={handleFeatureAccess} onPrefetch={handlePrefetch} />
        </Suspense>
      </div>
    </div>
  );
}
