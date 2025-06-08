"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import CompilingOverlay from "./CompilingOverlay";

interface CompilingContextType {
  isCompiling: boolean;
}

const CompilingContext = createContext<CompilingContextType>({ isCompiling: false });

export const useCompiling = () => useContext(CompilingContext);

export function CompilingProvider({ children }: { children: React.ReactNode }) {
  const [isCompiling, setIsCompiling] = useState(true); // Start with true for initial load
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Only show overlay on initial page load
    if (isInitialLoad) {
      const timer = setTimeout(() => {
        setIsCompiling(false);
        setIsInitialLoad(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isInitialLoad]);

  return (
    <CompilingContext.Provider value={{ isCompiling }}>
      {children}
      {isCompiling && <CompilingOverlay />}
    </CompilingContext.Provider>
  );
} 