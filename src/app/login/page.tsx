"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, Facebook, Loader2, ChevronLeft, KeyRound } from "lucide-react";
import Link from "next/link";
import { useAuth, useFirestore } from "@/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();

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
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      syncUserToFirestore(result.user);
      router.push("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google Sync Error",
        description: error.message,
      });
    }
  };

  const videoUrl = "https://res.cloudinary.com/drmpjeatm/video/upload/q_auto/f_auto/v1777231976/14311882_1920_1080_30fps_mi3cv9.mp4";

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-black overflow-hidden">
      {/* Immersive Background Video */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        {/* Darkened Overlay to ensure card visibility and thematic consistency */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      </div>

      <Link href="/" className="absolute top-6 left-6 z-50">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full bg-background border-2 border-primary shadow-[0_0_15px_rgba(228,54,54,0.3)] hover:bg-background/90"
        >
          <ChevronLeft className="w-5 h-5 text-primary" />
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
              disabled={loading}
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
              variant="outline"
              onClick={handleGoogleLogin}
              className="w-full h-11 bg-background/20 border-border/40 text-[9px] text-foreground hover:bg-background/40 rounded-xl font-bold uppercase tracking-widest backdrop-blur-sm"
            >
              Sync with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}