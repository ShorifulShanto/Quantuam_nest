
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
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  const [googleLoading, setGoogleLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, []);

  const syncUserToFirestore = (user: any) => {
    if (!db) return;
    const userRef = doc(db, 'users', user.uid);
    setDoc(userRef, {
      id: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      updatedAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    }, { merge: true });
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !email) return;
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Transmission Sent",
        description: "Protocol reset instructions dispatched to your email.",
      });
      setIsResetMode(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Protocol Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isResetMode) return handlePasswordReset(e);
    if (!auth) return;
    setLoading(true);
    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName) {
          await updateProfile(userCredential.user, { displayName });
        }
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      
      syncUserToFirestore(userCredential.user);
      router.push("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: error.message || "Invalid mission credentials.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth) {
      toast({
        variant: "destructive",
        title: "System Error",
        description: "Authentication archives are not yet initialized.",
      });
      return;
    }
    
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        syncUserToFirestore(result.user);
        toast({
          title: "Identity Verified",
          description: `Welcome back, Explorer ${result.user.displayName || ''}.`,
        });
        router.push("/");
      }
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      let errorMessage = "Google synchronization failed.";
      
      if (error.code === 'auth/popup-blocked') {
        errorMessage = "The identity popup was blocked by your browser. Please allow popups for this archive.";
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = "Synchronization request was cancelled.";
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Identity window closed before verification.";
      }

      toast({
        variant: "destructive",
        title: "Google Sync Error",
        description: errorMessage,
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const videoUrl = "https://res.cloudinary.com/drmpjeatm/video/upload/q_auto/f_auto/v1777563847/14777479_3840_2160_30fps_rujors.mp4";

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-black overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      </div>

      <Link href="/" className="absolute top-6 left-6 z-50">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full bg-[#F7F1D6] border-2 border-[#E43636] shadow-[0_0_15px_rgba(228,54,54,0.3)] hover:bg-[#F7F1D6]/90"
        >
          <ChevronLeft className="w-5 h-5 text-[#E43636]" />
        </Button>
      </Link>

      <Card className="w-full max-w-[300px] relative z-30 rounded-[2rem] border-2 border-white/20 overflow-hidden animate-in fade-in zoom-in duration-700 shadow-[0_0_80px_rgba(228,54,54,0.5)] bg-[#F7F1D6]/20 backdrop-blur-2xl backdrop-saturate-150 ring-1 ring-white/10">
        <CardHeader className="text-center pb-4 pt-8 px-5">
          <div className="w-14 h-14 bg-background rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(228,54,54,0.3)] border border-primary/30">
            {isResetMode ? <KeyRound className="w-7 h-7 text-primary" /> : <Rocket className="w-7 h-7 text-primary" />}
          </div>
          <CardTitle className="font-headline text-2xl font-bold tracking-tight text-foreground drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
            {isResetMode ? "Reset Protocol" : isSignUp ? "Initialize" : "Welcome Back"}
          </CardTitle>
          <p className="text-[#E43636] font-bold uppercase tracking-[0.4em] text-[9px] mt-1.5 drop-shadow-[0_0_8px_rgba(228,54,54,0.8)]">
            Quantum Nest Archive
          </p>
        </CardHeader>

        <CardContent className="p-5 pt-0 space-y-5">
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-3">
              {isSignUp && !isResetMode && (
                <Input
                  type="text"
                  placeholder="Explorer Identity"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-background/40 border-primary/20 rounded-xl h-11 text-sm text-foreground focus:ring-primary backdrop-blur-md shadow-sm placeholder:text-foreground/50"
                  required={isSignUp}
                />
              )}
              <Input
                type="email"
                placeholder="Explorer Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/40 border-primary/20 rounded-xl h-11 text-sm text-foreground focus:ring-primary backdrop-blur-md shadow-sm placeholder:text-foreground/50"
                required
              />
              {!isResetMode && (
                <Input
                  type="password"
                  placeholder="Access Key"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/40 border-primary/20 rounded-xl h-11 text-sm text-foreground focus:ring-primary backdrop-blur-md shadow-sm placeholder:text-foreground/50"
                  required
                />
              )}
            </div>
            
            <Button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full h-11 bg-primary text-white font-bold rounded-xl text-[10px] uppercase tracking-widest hover:scale-[1.01] transition-all shadow-lg shadow-primary/20"
            >
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : (isResetMode ? "Dispatch Reset" : isSignUp ? "Create Identity" : "Launch Mission")}
            </Button>
          </form>

          <div className="flex flex-col items-center gap-3">
            <button 
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setIsResetMode(false);
              }}
              className="text-[9px] text-[#E43636] hover:underline uppercase tracking-widest font-bold drop-shadow-[0_0_8px_rgba(228,54,54,0.8)]"
            >
              {isSignUp ? "Already identified? Log in" : "New Explorer? Initialize here"}
            </button>
            
            {!isSignUp && (
              <button 
                type="button"
                onClick={() => setIsResetMode(!isResetMode)}
                className="text-[9px] text-black hover:text-foreground uppercase tracking-widest font-bold drop-shadow-sm"
              >
                {isResetMode ? "Return to authentication" : "Misplaced your access key?"}
              </button>
            )}
          </div>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-black/10" />
            </div>
            <div className="relative flex justify-center text-[7px] uppercase tracking-[0.4em]">
              <span className="bg-transparent px-3 text-muted-foreground font-bold drop-shadow-sm">External Sync</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={googleLoading || loading}
              onClick={handleGoogleLogin}
              className="w-full h-11 bg-background/20 border-border/40 text-[9px] text-foreground hover:bg-background/40 rounded-xl font-bold uppercase tracking-widest backdrop-blur-sm transition-all flex items-center justify-center"
            >
              {googleLoading ? <Loader2 className="animate-spin w-4 h-4" /> : (
                <>
                  <GoogleIcon />
                  Sync with Google
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
