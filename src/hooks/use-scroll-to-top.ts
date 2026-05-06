import { useEffect } from "react";

/**
 * Scrolls window (and main content area) to the top whenever the component mounts.
 */
export function useScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    // Also reset any scrollable main container
    const main = document.querySelector("main");
    if (main) main.scrollTop = 0;
  }, []);
}
