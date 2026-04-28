
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Telescope, Orbit, Weight, Wind, Timer, Moon } from "lucide-react";

const planets = [
  { name: "Mercury", dist: "57.9m km", gravity: "3.7 m/s²", atmosphere: "Thin (He, Na, P)", type: "Terrestrial", day: "58.6 days", moons: 0 },
  { name: "Venus", dist: "108.2m km", gravity: "8.87 m/s²", atmosphere: "Thick CO2", type: "Terrestrial", day: "243 days", moons: 0 },
  { name: "Earth", dist: "149.6m km", gravity: "9.81 m/s²", atmosphere: "N2, O2", type: "Terrestrial", day: "24 hours", moons: 1 },
  { name: "Mars", dist: "227.9m km", gravity: "3.72 m/s²", atmosphere: "Thin CO2", type: "Terrestrial", day: "24.6 hours", moons: 2 },
  { name: "Jupiter", dist: "778.6m km", gravity: "24.79 m/s²", atmosphere: "H, He", type: "Gas Giant", day: "9.9 hours", moons: 95 },
  { name: "Saturn", dist: "1.43b km", gravity: "10.44 m/s²", atmosphere: "H, He", type: "Gas Giant", day: "10.7 hours", moons: 146 },
  { name: "Uranus", dist: "2.87b km", gravity: "8.69 m/s²", atmosphere: "H, He, CH4", type: "Ice Giant", day: "17.2 hours", moons: 27 },
  { name: "Neptune", dist: "4.50b km", gravity: "11.15 m/s²", atmosphere: "H, He, CH4", type: "Ice Giant", day: "16.1 hours", moons: 14 },
];

export default function PlanetsPage() {
  return (
    <div className="container mx-auto px-4 py-12 pb-24 md:pb-12">
      <div className="max-w-3xl mb-12">
        <h1 className="font-headline text-5xl font-bold mb-6">Planet Exploration</h1>
        <p className="text-lg text-muted-foreground">
          A comprehensive guide to the planets in our solar system. From the scorched rocky surfaces of the inner planets to the massive swirling storms of the gas giants.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {planets.slice(0, 4).map((planet) => (
          <Card key={planet.name} className="bg-card/30 border-border/40 hover:bg-card/50 transition-all cursor-default group shadow-xl">
            <CardHeader>
               <div className="flex justify-between items-start">
                  <CardTitle className="font-headline text-2xl group-hover:text-accent transition-colors">{planet.name}</CardTitle>
                  <Badge variant="outline" className="border-accent/30 text-accent">{planet.type}</Badge>
               </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Orbit className="w-4 h-4 text-accent" />
                <span>{planet.dist} from Sun</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Weight className="w-4 h-4 text-accent" />
                <span>Gravity: {planet.gravity}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Wind className="w-4 h-4 text-accent" />
                <span>{planet.atmosphere}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card/20 border-border/40 overflow-hidden shadow-2xl">
        <CardHeader className="bg-primary/5 border-b border-border/40">
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Telescope className="text-primary" /> Comparative Planetology Data
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
           <Table>
             <TableHeader>
               <TableRow className="border-border/40 hover:bg-transparent bg-background/40">
                 <TableHead>Planet</TableHead>
                 <TableHead>Type</TableHead>
                 <TableHead>Day Length</TableHead>
                 <TableHead>Gravity</TableHead>
                 <TableHead><div className="flex items-center gap-1"><Moon className="w-3 h-3"/> Moons</div></TableHead>
                 <TableHead className="hidden lg:table-cell">Atmosphere</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {planets.map((planet) => (
                 <TableRow key={planet.name} className="border-border/40 hover:bg-accent/5">
                   <TableCell className="font-bold text-foreground">{planet.name}</TableCell>
                   <TableCell className="text-muted-foreground text-xs">{planet.type}</TableCell>
                   <TableCell className="text-muted-foreground text-xs">
                    <div className="flex items-center gap-1"><Timer className="w-3 h-3 opacity-50"/> {planet.day}</div>
                   </TableCell>
                   <TableCell className="text-muted-foreground text-xs">{planet.gravity}</TableCell>
                   <TableCell className="text-muted-foreground text-xs">{planet.moons}</TableCell>
                   <TableCell className="text-muted-foreground text-xs hidden lg:table-cell">{planet.atmosphere}</TableCell>
                 </TableRow>
               ))}
             </TableBody>
           </Table>
        </CardContent>
      </Card>
    </div>
  );
}
