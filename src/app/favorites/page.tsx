
"use client";

import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, ExternalLink, Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function FavoritesPage() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();

  const favoritesQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, "users", user.uid, "favorites"),
      orderBy("savedAt", "desc")
    );
  }, [db, user?.uid]);

  const { data: favorites, loading: dataLoading } = useCollection(favoritesQuery);

  const handleDelete = (id: string) => {
    if (!user || !db) return;
    const docRef = doc(db, "users", user.uid, "favorites", id);
    deleteDoc(docRef);
  };

  if (authLoading || dataLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-48 mb-8 bg-card/40" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[300px] w-full rounded-2xl bg-card/40" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Star className="w-10 h-10 text-primary animate-star" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Archives Locked</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          Please sign in to access your personal collection of cosmic discoveries.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-24 lg:pb-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-2xl bg-primary/10">
          <Heart className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline">My Collection</h1>
          <p className="text-muted-foreground text-sm">Your personal cosmic library.</p>
        </div>
      </div>

      {!favorites || favorites.length === 0 ? (
        <Card className="bg-card/20 border-dashed border-border/60 py-12 flex flex-col items-center justify-center text-center">
          <p className="text-muted-foreground mb-4">No items saved yet.</p>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/apod">Explore Daily Photos</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((item: any) => (
            <Card key={item.id} className="bg-card/30 border-border/40 overflow-hidden group hover:border-primary/50 transition-all">
              <div className="relative aspect-video w-full">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  unoptimized
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-1">{item.title}</CardTitle>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">{item.type} • {item.date}</p>
              </CardHeader>
              <CardFooter className="flex justify-between gap-2">
                <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="w-4 h-4 mr-2" /> Remove
                </Button>
                {item.type === 'apod' && (
                  <Button asChild variant="secondary" size="sm">
                    <Link href="/apod">
                      <ExternalLink className="w-4 h-4 mr-2" /> View
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
