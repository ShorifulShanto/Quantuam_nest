
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, Loader2, ChevronLeft, KeyRound } from "lucide-react";
import Link from "next/link";
import { useAuth, useFirestore } from "@/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider, 
  signInWithRedirect, 
  getRedirectResult,
  updateProfile,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(true);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    if (!auth) return;
    
    // Attempt to resolve any pending redirect results
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          syncUserToFirestore(result.user);
          router.push("/");
        }
      })
      .catch((error) => {
        // Handle only significant errors, ignore if it's just no redirect result
        if (error.code !== 'auth/no-redirect-result') {
          console.error("Auth Protocol Error:", error);
          toast({
            variant: "destructive",
            title: "Archival Access Denied",
            description: error.message || "Identification sync failed.",
          });
        }
      })
      .finally(() => {
        setGoogleLoading(false);
      });
  }, [auth, router]);

  // Fallback for video loading to prevent permanent black screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVideoLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const syncUserToFirestore = async (user: any) => {
    if (!db) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        id: user.uid,
        displayName: user.displayName || displayName || "Explorer",
        email: user.email,
        photoURL: user.photoURL,
        rank: "Explorer",
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (e) {
      // Silent fail as Firestore might not be indexed yet during dev
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;

    if (isResetMode) {
      if (!email) {
        toast({ title: "Email Required", description: "Provide address for reset protocol." });
        return;
      }
      setLoading(true);
      try {
        await sendPasswordResetEmail(auth, email);
        toast({ title: "Transmission Sent", description: "Reset protocols dispatched." });
        setIsResetMode(false);
      } catch (error: any) {
        toast({ variant: "destructive", title: "Protocol Error", description: error.message });
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName) await updateProfile(userCredential.user, { displayName });
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      await syncUserToFirestore(userCredential.user);
      router.push("/");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Access Denied", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth) return;
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithRedirect(auth, provider);
    } catch (error: any) {
      setGoogleLoading(false);
      toast({ variant: "destructive", title: "Sync Error", description: error.message });
    }
  };

  const videoUrl = "https://res.cloudinary.com/drmpjeatm/video/upload/w_1280,vc_h264,q_auto:eco/v1777904615/13049989_1080_1920_30fps_itlps3.mp4";

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-black overflow-hidden">
      <div className="fixed inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onCanPlay={() => setIsVideoLoading(false)}
          onPlaying={() => setIsVideoLoading(false)}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
            isVideoLoading ? 'opacity-0' : 'opacity-100'
          )}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px]" />
      </div>

      <Link href="/" className="absolute top-6 left-6 z-50">
        <Button variant="ghost" size="icon" className="rounded-full bg-background/20 border-2 border-primary">
          <ChevronLeft className="w-5 h-5 text-primary" />
        </Button>
      </Link>

      <Card className="w-full max-w-[280px] relative z-30 rounded-[2rem] border-2 border-white/20 bg-card/40 backdrop-blur-3xl shadow-2xl animate-in fade-in zoom-in duration-700">
        <CardHeader className="text-center pt-8 pb-4">
          <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center mx-auto mb-2 border border-primary/30 shadow-[0_0_15px_rgba(228,54,54,0.2)]">
            {isResetMode ? <KeyRound className="w-5 h-5 text-primary" /> : <Rocket className="w-5 h-5 text-primary" />}
          </div>
          <CardTitle className="font-headline text-lg font-bold text-white uppercase tracking-tight">
            {isResetMode ? "Reset" : isSignUp ? "Initialize" : "Welcome"}
          </CardTitle>
          <p className="text-primary font-bold uppercase tracking-[0.4em] text-[7px] mt-1">Archive Protocol</p>
        </CardHeader>

        <CardContent className="space-y-4 px-6 pb-8">
          <form onSubmit={handleAuth} className="space-y-2">
            {isSignUp && !isResetMode && (
              <Input
                placeholder="Identity"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-background/40 border-primary/20 h-9 text-[10px]"
                required
              />
            )}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background/40 border-primary/20 h-9 text-[10px]"
              required
            />
            {!isResetMode && (
              <Input
                type="password"
                placeholder="Access Key"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/40 border-primary/20 h-9 text-[10px]"
                required
              />
            )}
            <Button disabled={loading || googleLoading} className="w-full h-9 bg-primary text-[9px] font-bold uppercase tracking-widest mt-2">
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : (isResetMode ? "Dispatch" : isSignUp ? "Create" : "Launch")}
            </Button>
          </form>

          <div className="flex flex-col items-center gap-2">
            <button onClick={() => { setIsSignUp(!isSignUp); setIsResetMode(false); }} className="text-[7px] text-primary uppercase font-bold tracking-widest hover:underline">
              {isSignUp ? "Join Protocol" : "New Explorer?"}
            </button>
            {!isSignUp && (
              <button onClick={() => setIsResetMode(!isResetMode)} className="text-[7px] text-white/60 uppercase font-bold tracking-widest hover:text-white">
                {isResetMode ? "Return" : "Lost Key?"}
              </button>
            )}
          </div>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
            <div className="relative flex justify-center"><span className="bg-transparent px-2 text-[6px] text-white/40 uppercase tracking-[0.3em]">Sync</span></div>
          </div>

          <Button variant="outline" disabled={googleLoading || loading} onClick={handleGoogleLogin} className="w-full h-9 bg-background/20 border-primary/30 text-[8px] font-bold uppercase tracking-widest">
            {googleLoading ? <Loader2 className="animate-spin w-3 h-3" /> : <><GoogleIcon /> Google Sync</>}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
