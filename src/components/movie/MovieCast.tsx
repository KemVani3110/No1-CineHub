import { TMDBCredits } from "@/types/tmdb";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Camera, Award, Star, ChevronRight, Loader2 } from "lucide-react";
import { getImageUrl } from "@/services/tmdb";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface MovieCastProps {
  credits: TMDBCredits | null;
  isLoading?: boolean;
}

export default function MovieCast({ credits, isLoading = false }: MovieCastProps) {
  const [showAllCast, setShowAllCast] = useState(false);
  const [showAllCrew, setShowAllCrew] = useState(false);
  
  if (isLoading) {
    return <CastSkeleton />;
  }

  if (!credits) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">No cast information available.</p>
      </div>
    );
  }

  const displayCast = showAllCast ? credits.cast : credits.cast.slice(0, 12);
  const keyCrewRoles = ["Director", "Producer", "Executive Producer", "Screenplay", "Writer", "Cinematography", "Music", "Editor"];
  const keyCrew = credits.crew.filter((person) =>
    keyCrewRoles.includes(person.job)
  );
  const displayCrew = showAllCrew ? keyCrew : keyCrew.slice(0, 8);

  const CastCard = ({ person }: { person: typeof credits.cast[0] }) => (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-xl bg-slate-800">
        {/* Profile Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={
              person.profile_path
                ? getImageUrl(person.profile_path, "w500")
                : "/images/no-profile.jpg"
            }
            alt={person.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Info */}
        <div className="p-4">
          <h4 className="font-semibold text-white text-sm leading-tight mb-1 group-hover:text-blue-400 transition-colors">
            {person.name}
          </h4>
          <p className="text-slate-400 text-xs leading-tight line-clamp-2">
            {person.character}
          </p>
          {person.popularity && (
            <div className="flex items-center gap-1 mt-2">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs text-slate-500">
                {person.popularity.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const CrewCard = ({ person }: { person: typeof credits.crew[0] }) => (
    <div className="group">
      <Card className="bg-slate-800/50 border-slate-600 hover:border-orange-500/50 transition-all duration-300 group-hover:bg-slate-800/80">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            {/* Profile Image */}
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-700 flex-shrink-0">
              <img
                src={
                  person.profile_path
                    ? getImageUrl(person.profile_path, "w500")
                    : "/images/no-profile.jpg"
                }
                alt={person.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white text-base leading-tight mb-1 group-hover:text-orange-400 transition-colors">
                {person.name}
              </h4>
              <Badge 
                variant="outline" 
                className="border-orange-500/30 text-orange-400 text-xs bg-orange-500/10"
              >
                {person.job}
              </Badge>
              {person.department && person.department !== person.job && (
                <p className="text-slate-400 text-xs mt-1">
                  {person.department}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Cast Section */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <Users className="w-7 h-7 text-blue-400" />
              Main Cast
              <Badge variant="secondary" className="bg-blue-900/50 text-blue-300">
                {credits.cast.length}
              </Badge>
            </h3>
            {credits.cast.length > 12 && (
              <Button
                variant="ghost"
                onClick={() => setShowAllCast(!showAllCast)}
                className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
              >
                {showAllCast ? 'Show Less' : 'Show All'}
                <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${showAllCast ? 'rotate-90' : ''}`} />
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {displayCast.map((person) => (
              <CastCard key={person.id} person={person} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Crew Section */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <Camera className="w-7 h-7 text-orange-400" />
              Key Crew
              <Badge variant="secondary" className="bg-orange-900/50 text-orange-300">
                {keyCrew.length}
              </Badge>
            </h3>
            {keyCrew.length > 8 && (
              <Button
                variant="ghost"
                onClick={() => setShowAllCrew(!showAllCrew)}
                className="text-orange-400 hover:text-orange-300 hover:bg-orange-900/20"
              >
                {showAllCrew ? 'Show Less' : 'Show All'}
                <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${showAllCrew ? 'rotate-90' : ''}`} />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCrew.map((person) => (
              <CrewCard key={person.credit_id} person={person} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Crew by Department */}
      {credits.crew.length > keyCrew.length && (
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Award className="w-7 h-7 text-purple-400" />
              Crew by Department
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from(new Set(credits.crew.map(person => person.department))).map(department => {
                const departmentCrew = credits.crew.filter(person => person.department === department);
                return (
                  <div key={department} className="space-y-3">
                    <h4 className="text-lg font-semibold text-purple-400 border-b border-purple-500/30 pb-2">
                      {department}
                    </h4>
                    <div className="space-y-2">
                      {departmentCrew.slice(0, 5).map(person => (
                        <div key={person.credit_id} className="flex justify-between items-center text-sm">
                          <span className="text-slate-300">{person.name}</span>
                          <span className="text-slate-500 text-xs">{person.job}</span>
                        </div>
                      ))}
                      {departmentCrew.length > 5 && (
                        <p className="text-xs text-slate-500 italic">
                          +{departmentCrew.length - 5} more
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CastSkeleton() {
  return (
    <div className="space-y-8">
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Skeleton className="w-7 h-7 rounded-full" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}