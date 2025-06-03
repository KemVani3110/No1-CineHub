// 'use client';

// import { useQuery } from '@tanstack/react-query';
// import { Star, Play } from 'lucide-react';
// import { fetchMovies, getImageUrl } from '@/services/tmdb';
// import { TMDBMovieListType } from '@/types/tmdb';

// const FeaturedMovies = () => {
//   const { data, status } = useQuery({
//     queryKey: ['movies', 'top_rated'],
//     queryFn: () => fetchMovies('top_rated' as TMDBMovieListType, 1),
//   });

//   if (status === 'error') {
//     return <div>Error loading featured movies</div>;
//   }

//   if (status === 'pending') {
//     return (
//       <section className="mb-12">
//         <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Poppins' }}>Featured Movies</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {[1, 2, 3].map((i) => (
//             <div 
//               key={i}
//               className="rounded-lg overflow-hidden animate-pulse"
//               style={{ backgroundColor: '#1B263B' }}
//             >
//               <div className="aspect-[2/3] bg-gray-700" />
//               <div className="p-4">
//                 <div className="h-6 bg-gray-700 rounded mb-2" />
//                 <div className="flex items-center justify-between">
//                   <div className="h-4 w-16 bg-gray-700 rounded" />
//                   <div className="h-4 w-12 bg-gray-700 rounded" />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>
//     );
//   }

//   const featuredMovies = data?.results?.slice(0, 3) || [];

//   return (
//     <section className="mb-12">
//       <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Poppins' }}>Featured Movies</h3>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {featuredMovies.map((movie) => (
//           <div 
//             key={movie.id}
//             className="group rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer"
//             style={{ backgroundColor: '#1B263B' }}
//           >
//             <div className="aspect-[2/3] relative">
//               {movie.poster_path && (
//                 <img 
//                   src={getImageUrl(movie.poster_path, 'w500')}
//                   alt={movie.title}
//                   className="w-full h-full object-cover"
//                 />
//               )}
//               <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//                 <Play className="w-12 h-12" style={{ color: '#4FD1C5' }} />
//               </div>
//             </div>
//             <div className="p-4">
//               <h4 className="font-bold text-lg mb-2" style={{ fontFamily: 'Poppins' }}>{movie.title}</h4>
//               <div className="flex items-center justify-between">
//                 <span style={{ color: '#9AAFC3' }}>
//                   {new Date(movie.release_date).getFullYear()}
//                 </span>
//                 <div className="flex items-center space-x-1">
//                   <Star className="w-4 h-4 fill-current" style={{ color: '#F4B400' }} />
//                   <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default FeaturedMovies; 