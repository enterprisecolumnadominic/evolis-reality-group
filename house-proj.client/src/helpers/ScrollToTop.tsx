import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // This tells the window to jump to coordinates (0,0)
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]); // This runs every time the path changes

  return null; // This component doesn't render anything visual
};

export default ScrollToTop;
