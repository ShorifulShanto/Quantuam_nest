
'use client';

import { useState } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, User as UserIcon, Shield, Rocket, Sparkles, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const [isEditing, setIsEditing] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');

  const userDocRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userDocRef);

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Explorer Profile Not Found</h1>
        <p className="text-muted-foreground">Please ensure you are signed into the archives.</p>
      </div>
    );
  }

  const handleUpdateName = () => {
    if (!userDocRef || !newDisplayName.trim()) return;
    updateDocumentNonBlocking(userDocRef, {
      displayName: newDisplayName.trim(),
    });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-12 pb-24 lg:pb-12 max-w-4xl">
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="relative group">
          <Avatar className="h-32 w-32 border-4 border-primary shadow-[0_0_30px_rgba(228,54,54,0.3)]">
            <AvatarImage src={profile.photoURL || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-4xl">
              <UserIcon size={48} />
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 -right-2 bg-accent rounded-full p-2 border-2 border-background shadow-lg">
            <Shield className="w-5 h-5 text-accent-foreground" />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            {isEditing ? (
              <div className="flex gap-2">
                <Input
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  className="bg-background/40 h-10 border-primary/20"
                  placeholder="New Identity"
                />
                <Button size="sm" onClick={handleUpdateName}>Save</Button>
                <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
            ) : (
              <>
                <h1 className="text-4xl font-bold font-headline">{profile.displayName || 'Unnamed Explorer'}</h1>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-fit self-center md:self-auto text-[10px] uppercase font-bold tracking-widest text-primary hover:bg-primary/10"
                  onClick={() => {
                    setNewDisplayName(profile.displayName || '');
                    setIsEditing(true);
                  }}
                >
                  Edit Identity
                </Button>
              </>
            )}
          </div>
          <p className="text-muted-foreground font-mono text-sm tracking-tight">{profile.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 uppercase tracking-widest text-[9px]">
              Rank: {profile.rank || 'Novice'}
            </Badge>
            <Badge variant="outline" className="border-accent/30 text-accent uppercase tracking-widest text-[9px]">
              ID: {profile.id.slice(0, 8)}...
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-1000 delay-200">
        <Card className="bg-card/30 border-2 border-primary rounded-[2rem] overflow-hidden shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-3">
              <Rocket className="w-5 h-5 text-primary" /> Active Enrollments
            </CardTitle>
            <CardDescription className="text-xs uppercase tracking-[0.2em] font-bold">
              Current Mission Protocols
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.enrolledMissions && profile.enrolledMissions.length > 0 ? (
              <div className="space-y-3">
                {profile.enrolledMissions.map((mission: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-background/40 rounded-xl border border-border/40">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium">{mission}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground italic">No active enrollments found.</p>
                <Button variant="link" className="text-primary text-xs mt-2 uppercase tracking-widest font-bold">
                  Browse Missions
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/30 border-2 border-primary rounded-[2rem] overflow-hidden shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-primary" /> Archival Log
            </CardTitle>
            <CardDescription className="text-xs uppercase tracking-[0.2em] font-bold">
              Mission Activity Sync
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-4">
               <div className="flex justify-between items-center text-xs">
                 <span className="text-muted-foreground">Joined Archival Hub</span>
                 <span className="font-mono font-bold">Jan 2026</span>
               </div>
               <Separator className="bg-primary/10" />
               <div className="flex justify-between items-center text-xs">
                 <span className="text-muted-foreground">Total Discoveries</span>
                 <span className="font-mono font-bold">128 Artifacts</span>
               </div>
               <Separator className="bg-primary/10" />
               <div className="flex justify-between items-center text-xs">
                 <span className="text-muted-foreground">Last Sync Protocol</span>
                 <span className="font-mono font-bold">Active</span>
               </div>
             </div>
             <div className="pt-4">
                <Button className="w-full h-11 rounded-xl text-[10px] uppercase font-bold tracking-widest shadow-lg shadow-primary/20">
                  Sync All Archives
                </Button>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
