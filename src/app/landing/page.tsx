"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Loading from "@/components/common/Loading";
import { withLazyLoading } from "@/components/lazy";

const LandingPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Auto redirect after 5 seconds
    const redirectTimer = setTimeout(() => {
      router.push("/home");
    }, 5000);

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        <Loading message="Welcome to CineHub..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with movie posters pattern */}
      <div className="absolute inset-0">
        {/* Dark overlay with movie poster pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-slate-900/95 to-black/95 z-10"></div>

        {/* Movie posters background pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='150' viewBox='0 0 100 150' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='150' fill='%23ffffff' opacity='0.05'/%3E%3Crect x='10' y='10' width='80' height='130' rx='8' fill='none' stroke='%23ffffff' stroke-width='1' opacity='0.1'/%3E%3C/svg%3E")`,
            backgroundSize: "120px 180px",
          }}
        ></div>

        {/* Additional decorative elements */}
        <motion.div
          className="absolute -top-20 -left-20 w-40 h-40 bg-cinehub-accent/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-60 h-60 bg-cinehub-accent/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Logo */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                {/* Logo container with glow effect */}
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="absolute inset-0 bg-cinehub-accent/20 rounded-2xl blur-xl"></div>
                  <div className="relative w-full h-full rounded-2xl flex items-center justify-center">
                    <Image
                      src="/logo.png"
                      alt="CineHub Logo"
                      fill
                      className="object-contain rounded-full"
                      priority
                    />
                  </div>
                </div>

                {/* Logo text */}
                <div className="flex items-center justify-center space-x-3">
                  <h1 className="text-4xl font-bold text-white">CineHub</h1>
                  <div className="h-6 w-px bg-gradient-to-b from-cinehub-accent to-transparent"></div>
                  <span className="text-text-sub text-lg">Movies & Shows</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Watch Movies & TV Shows
              <br />
              <span className="bg-gradient-to-r from-cinehub-accent to-cinehub-accent-hover bg-clip-text text-transparent">
                Fast, Free & High Quality
              </span>
              <br />
              Updated Daily
            </h2>

            <motion.p
              className="text-xl md:text-2xl text-text-sub max-w-3xl mx-auto leading-relaxed"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Discover thousands of the best movies and TV series in HD quality,
              completely free and ad-free streaming experience
            </motion.p>
          </motion.div>

          {/* Call to Action Button */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mb-16"
          >
            <button
              onClick={() => router.push("/home")}
              className="group relative inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-cinehub-accent to-cinehub-accent-hover hover:from-cinehub-accent-hover hover:to-cinehub-accent text-white px-12 py-5 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cinehub-accent/25 cursor-pointer"
            >
              <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span>Watch Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />

              {/* Button glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cinehub-accent to-cinehub-accent-hover opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
            </button>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {[
              "🎬 50,000+ Movies & Shows",
              "⚡ Lightning Fast Streaming",
              "🎭 All Genres Available",
              "📱 Watch on Any Device",
              "🔄 Updated Daily",
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                className="bg-bg-card/50 backdrop-blur-sm border border-border/30 rounded-full px-6 py-3 text-text-main hover:bg-bg-card/70 hover:border-cinehub-accent/30 transition-all duration-300 hover:scale-105"
              >
                {feature}
              </motion.div>
            ))}
          </motion.div>

          {/* Auto redirect notification */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="flex items-center justify-center space-x-3 text-text-sub"
          >
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-cinehub-accent rounded-full animate-pulse"></div>
              <div
                className="w-2 h-2 bg-cinehub-accent rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-cinehub-accent rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
            <span className="text-sm">Auto-redirecting in 5 seconds...</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Background particles effect */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cinehub-accent/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default withLazyLoading(LandingPage);