"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [showNav, setShowNav] = useState(true);
  const [lastYOffset, setLastYOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.pageYOffset;
      if (currentY > lastYOffset && currentY > 60) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }
      setLastYOffset(currentY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastYOffset]);

  return (
    <nav
      className={`sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl transition-transform duration-300 ease-out shadow-sm ${
        showNav ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto flex w-full max-w-8xl items-center justify-between gap-6 px-6 py-4 sm:px-8 lg:px-8">
        <Link href="/" className="text-xl font-bold text-slate-950">
          <img src="/logo.svg" alt="Goglish Logo" className="h-20 w-auto" draggable="false" />
        </Link>
        <a
          href="https://forms.gle/tidDTjtAbQtxYjzZA"
          className="inline-flex items-center justify-center rounded-3xl bg-[#FFCC3A] px-6 py-2 text-sm font-semibold text-slate-950 shadow-xl shadow-[#FFCC3A]/20 transition hover:-translate-y-0.5"
        >
          احجز مكانك الآن
        </a>
      </div>
    </nav>
  );
}
