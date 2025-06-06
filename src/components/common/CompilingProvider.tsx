"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Loading from "./Loading";

interface CompilingContextType {
  isCompiling: boolean;
}

const CompilingContext = createContext<CompilingContextType>({ isCompiling: false });

export const useCompilingState = () => useContext(CompilingContext);

export function CompilingProvider({ children }: { children: React.ReactNode }) {
  const [isCompiling, setIsCompiling] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Set compiling state immediately when route changes
    setIsCompiling(true);

    // Reset compiling state after a short delay
    const timer = setTimeout(() => {
      setIsCompiling(false);
    }, 1000); // Reduced delay to 1 second

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return (
    <CompilingContext.Provider value={{ isCompiling }}>
      {children}
      {isCompiling && (
        <div className="fixed inset-0 z-50">
          <Loading message="Loading..." />
        </div>
      )}
    </CompilingContext.Provider>
  );
} 