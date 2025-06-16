'use client';

import { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import { useMotionValue, MotionValue } from "framer-motion";

const LenisContext = createContext<{ scrollY: MotionValue<number> } | null>(null);

export function LenisProvider({ children }: { children: React.ReactNode }) {
    const scrollY = useMotionValue(0);
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const lenis = new Lenis({ lerp: 0.1 });
        lenisRef.current = lenis;

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        lenis.on("scroll", ({ scroll }: { scroll: number }) => {
            scrollY.set(scroll);
        })

        return () => {
            lenis.destroy();
        };
    }, [scrollY])

    return (
        <LenisContext.Provider value={{ scrollY }}>
            <div data-scroll-container>
                {children}
            </div>
        </LenisContext.Provider>
    )
}

export function useLenisScroll() {
    const ctx = useContext(LenisContext);
    if (!ctx) {
        throw new Error("useLenisScroll must be used within a LenisProvider");
    }
    return ctx.scrollY;
}