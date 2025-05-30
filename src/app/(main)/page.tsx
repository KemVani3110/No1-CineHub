"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search,
  Play,
  Heart,
  Star,
  TrendingUp,
  Clock,
  Award
} from "lucide-react"

const featuredMovies = [
  {
    id: 1,
    title: "The Dark Knight",
    year: "2008",
    rating: 9.0,
    genre: "Action",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1489599904381-b6f38d6ee133?w=800&h=400&fit=crop"
  },
  {
    id: 2,
    title: "Inception",
    year: "2010", 
    rating: 8.8,
    genre: "Sci-Fi",
    poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=400&fit=crop"
  },
  {
    id: 3,
    title: "Interstellar",
    year: "2014",
    rating: 8.6,
    genre: "Drama",
    poster: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=450&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=400&fit=crop"
  }
]

const trendingMovies = [
  { id: 4, title: "Avatar 2", rating: 8.2, poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=200&h=300&fit=crop" },
  { id: 5, title: "Top Gun", rating: 8.7, poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=200&h=300&fit=crop" },
  { id: 6, title: "Spider-Man", rating: 8.4, poster: "https://images.unsplash.com/photo-1489599904381-b6f38d6ee133?w=200&h=300&fit=crop" },
  { id: 7, title: "Batman", rating: 8.1, poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&h=300&fit=crop" }
]

export default function HomePage() {
  const [selectedGenre, setSelectedGenre] = useState('All')
  const genres = ['All', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance']

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[600px]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${featuredMovies[0].backdrop})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent">
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {featuredMovies[0].title}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Epic action thriller that redefined superhero cinema. A masterpiece of storytelling and visual effects.
              </p>
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{featuredMovies[0].rating}</span>
                </div>
                <span className="text-muted-foreground">{featuredMovies[0].year}</span>
                <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-sm">
                  {featuredMovies[0].genre}
                </span>
              </div>
              <div className="flex gap-4">
                <Button size="lg" className="gap-2">
                  <Play className="w-5 h-5" />
                  Watch Now
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  <Heart className="w-5 h-5" />
                  Add to List
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search movies, TV shows..."
            className="pl-10"
          />
        </div>
      </section>

      {/* Genre Filter */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {genres.map((genre) => (
            <Button
              key={genre}
              variant={selectedGenre === genre ? "default" : "outline"}
              onClick={() => setSelectedGenre(genre)}
              className="whitespace-nowrap"
            >
              {genre}
            </Button>
          ))}
        </div>
      </section>

      {/* Featured Movies */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Featured Movies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredMovies.map((movie) => (
            <div
              key={movie.id}
              className="group relative rounded-lg overflow-hidden bg-card"
            >
              <div className="aspect-[2/3] relative">
                <div 
                  className="w-full h-full bg-cover bg-center transition-transform group-hover:scale-105"
                  style={{ backgroundImage: `url(${movie.poster})` }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="icon" className="w-12 h-12">
                    <Play className="w-6 h-6" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{movie.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{movie.year}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{movie.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Now */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Trending Now</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {trendingMovies.map((movie) => (
            <div
              key={movie.id}
              className="flex-shrink-0 w-40 group cursor-pointer"
            >
              <div className="aspect-[2/3] rounded-lg overflow-hidden mb-2">
                <div 
                  className="w-full h-full bg-cover bg-center transition-transform group-hover:scale-105"
                  style={{ backgroundImage: `url(${movie.poster})` }}
                />
              </div>
              <h3 className="font-medium text-sm mb-1">{movie.title}</h3>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{movie.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border bg-card p-6 transition-colors hover:bg-accent">
            <TrendingUp className="w-8 h-8 mb-4 text-primary" />
            <h3 className="font-semibold mb-2">Trending</h3>
            <p className="text-sm text-muted-foreground">
              Discover what's popular right now
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 transition-colors hover:bg-accent">
            <Clock className="w-8 h-8 mb-4 text-primary" />
            <h3 className="font-semibold mb-2">Watchlist</h3>
            <p className="text-sm text-muted-foreground">
              Your personalized watchlist
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 transition-colors hover:bg-accent">
            <Award className="w-8 h-8 mb-4 text-primary" />
            <h3 className="font-semibold mb-2">Top Rated</h3>
            <p className="text-sm text-muted-foreground">
              Highest rated movies and shows
            </p>
          </div>
        </div>
      </section>
    </div>
  )
} 