"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SearchBar } from "./search-bar";

export function StickySearch() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    function onScroll() {
      setCompact(window.scrollY > 48);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      className="sticky top-16 z-40 border-b border-mist-200 bg-white/95 backdrop-blur-md"
      animate={{ paddingTop: compact ? 10 : 18, paddingBottom: compact ? 10 : 18 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container-page">
        <motion.div animate={{ scale: compact ? 0.97 : 1 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>
          <SearchBar compact={compact} />
        </motion.div>
      </div>
    </motion.div>
  );
}
