// ./src/components/Loading.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function Loading() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrlRef = useRef<string | undefined>(undefined); // Explicit initial value of undefined

  // Update current URL reference
  useEffect(() => {
    currentUrlRef.current = `${pathname}?${searchParams}`;
  }, [pathname, searchParams]);

  // Detect meaningful navigation
  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest("a");
      if (!anchor) return;

      const targetUrl = new URL(anchor.href, location.origin);
      const currentUrl = new URL(currentUrlRef.current || "", location.origin);

      // Check if the target URL is different from the current URL
      if (
        targetUrl.pathname + targetUrl.search !==
        currentUrl.pathname + currentUrl.search
      ) {
        setIsLoading(true);
      }
    };

    const handleFormSubmit = () => setIsLoading(true);

    // Add event listeners
    document.addEventListener("click", handleAnchorClick);
    document.addEventListener("submit", handleFormSubmit);

    // Clean up event listeners
    return () => {
      document.removeEventListener("click", handleAnchorClick);
      document.removeEventListener("submit", handleFormSubmit);
    };
  },);

  // Reset loading state when navigation is complete
  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams]);

  // Don't render anything if not loading
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div className="gravity-loader">
        <div className="gravity-orb orb-1"></div>
        <div className="gravity-orb orb-2"></div>
        <div className="gravity-orb orb-3"></div>
        <div className="gravity-core"></div>
      </div>
    </div>
  );
}

export default Loading;