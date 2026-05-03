
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Rocket, 
  User, 
  LogOut, 
  ArrowLeft, 
  Search, 
  Sparkles, 
  Globe, 
  Menu, 
  Camera,
  Volume2,
  Settings
} from "lucide-react";
import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const bottomNavItems = [
  { name: "Earth", href: "/earth", icon: Globe },
  { name: "Search", href: "/search", icon: Search, center: true },
  { name: "Profile", href: "/profile", icon: User },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  // Real-time listener for user profile
  const userDocRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const { data: profile } = useDoc(userDocRef);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isHomePage = pathname === "/";
  const isLoginPage = pathname === "/login";

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push("/login");
  };

  const handleBack = () => {
    if (isHomePage) return;
    router.push("/");
  };

  const handleNavAccess = (e: React.MouseEvent, href: string) => {
    if (!user && href !== "/login" && href !== "/") {
      e.preventDefault();
      toast({
        title: "Mission Restricted",
        description: "Access requires authentication.",
        variant: "destructive",
      });
      router.push("/login");
    }
  };

  if (isLoginPage || !mounted) return null;

  return (
    <>
      <header className="sticky top-0 z-50 w-full glass-nav">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            {!isHomePage && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-1 rounded-full hover:bg-black/5" 
                onClick={handleBack}
              >
                <ArrowLeft className="w-5 h-5 text-black" />
              </Button>
            )}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Rocket className="w-4 h-4 text-white" />
              </div>
              <span className="font-headline text-lg font-bold tracking-tight text-black">
                QUANTUM NEST
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
             <Sheet>
               <SheetTrigger asChild>
                 <Button 
                   variant="ghost" 
                   size="icon" 
                   className="rounded-full bg-black/5 hover:bg-black/10 transition-all shadow-[0_0_15px_rgba(228,54,54,0.4)] border border-primary/30"
                 >
                   <Menu className="w-5 h-5 text-black" />
                 </Button>
               </SheetTrigger>
               <SheetContent side="right" className="bg-background border-l border-border/40 w-[300px] p-0">
                 <ScrollArea className="h-full w-full p-6">
                   <SheetHeader className="text-left mb-8">
                     <SheetTitle className="font-headline text-2xl font-bold text-black">Explorer Hub</SheetTitle>
                     <SheetDescription className="text-black/50">Recalibrate your mission path</SheetDescription>
                   </SheetHeader>

                   <div className="space-y-6">
                     <div className="bg-card/20 backdrop-blur-md p-5 rounded-2xl border-2 border-primary shadow-[0_0_20px_rgba(228,54,54,0.3)]">
                        {user ? (
                          <div className="space-y-4">
                            <Link href="/profile" className="flex items-center gap-4 group">
                              <Avatar className="h-12 w-12 border-2 border-primary/20 group-hover:border-primary transition-all">
                                <AvatarImage src={profile?.photoURL || user.photoURL || undefined} />
                                <AvatarFallback className="bg-primary/10 text-primary"><User /></AvatarFallback>
                              </Avatar>
                              <div className="overflow-hidden">
                                <p className="font-bold text-black truncate group-hover:text-primary transition-colors">
                                  {profile?.displayName || user.displayName || 'Unnamed Explorer'}
                                </p>
                                <p className="text-[10px] text-black/40 truncate uppercase tracking-widest">
                                  {profile?.rank || 'Level 1 Explorer'}
                                </p>
                              </div>
                            </Link>
                            <Separator className="bg-black/5" />
                            <div className="grid grid-cols-1 gap-2">
                               <Button variant="ghost" size="sm" className="w-full justify-start text-primary hover:bg-primary/5 gap-3 h-11" asChild>
                                  <Link href="/profile">
                                    <Settings className="w-4 h-4" /> <span className="text-[10px] uppercase font-bold tracking-widest">Profile Protocol</span>
                                  </Link>
                               </Button>
                               <Button variant="ghost" size="sm" className="w-full justify-start text-destructive hover:bg-destructive/5 gap-3 h-11" onClick={handleLogout}>
                                  <LogOut className="w-4 h-4" /> <span className="text-[10px] uppercase font-bold tracking-widest">Sign Out</span>
                               </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-2">
                            <Button asChild className="w-full bg-primary text-white font-bold rounded-xl h-12 shadow-lg shadow-primary/20">
                               <Link href="/login">INITIALIZE SESSION</Link>
                            </Button>
                          </div>
                        )}
                     </div>

                     <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-3 px-2">Archives</p>
                        {[
                          { name: "Star Atlas", href: "/star-patterns", icon: Sparkles },
                          { name: "Space Sounds", href: "/space-sounds", icon: Volume2 },
                          { name: "Daily Capture", href: "/apod", icon: Camera },
                          { name: "Solar System", href: "/solar-system", icon: Rocket },
                          { name: "Goldilocks", href: "/habitable-zone", icon: Globe },
                        ].map((item) => (
                          <Button 
                            key={item.href} 
                            variant="ghost" 
                            className="w-full justify-start gap-4 rounded-xl py-6 hover:bg-black/5 transition-colors" 
                            asChild
                          >
                            <Link href={item.href} onClick={(e) => handleNavAccess(e, item.href)}>
                              <item.icon className="w-5 h-5 text-primary" /> <span className="font-headline text-sm font-medium">{item.name}</span>
                            </Link>
                          </Button>
                        ))}
                     </div>
                   </div>
                 </ScrollArea>
               </SheetContent>
             </Sheet>
          </div>
        </div>
      </header>

      {/* Bottom Nav for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-border/40 pb-safe md:hidden">
        <div className="grid grid-cols-3 h-16 container mx-auto max-w-md">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            if (item.center) {
              return (
                <div key={item.href} className="flex justify-center -mt-6">
                  <Link
                    href={item.href}
                    onClick={(e) => handleNavAccess(e, item.href)}
                    className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110 active:scale-95",
                      isActive ? "bg-primary text-white shadow-primary/40" : "bg-card border-2 border-primary/20 text-primary shadow-[0_0_15px_rgba(228,54,54,0.3)]"
                    )}
                  >
                    <Icon className="w-6 h-6" />
                  </Link>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavAccess(e, item.href)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 transition-all",
                  isActive ? "text-primary" : "text-black/40"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-bold uppercase tracking-tight">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
