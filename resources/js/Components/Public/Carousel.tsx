import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { createPortal } from "react-dom"; // <-- We added this!

// Loads your images just like before
const modules = import.meta.glob(
    "/public/images/carousel/*.{png,jpg,jpeg,webp}",
    {
        eager: true,
        query: "?url",
        import: "default",
    },
) as Record<string, string>;

const imagePaths = Object.keys(modules).sort((a, b) => {
    const numA = parseInt(a.match(/(\d+)\.(png|jpg|jpeg|webp)$/)?.[1] || "0");
    const numB = parseInt(b.match(/(\d+)\.(png|jpg|jpeg|webp)$/)?.[1] || "0");
    return numA - numB;
});

const IMAGES = imagePaths.map((path) => modules[path]);

export default function Carousel() {
    const [active, setActive] = useState(0);
    const [viewerIndex, setViewerIndex] = useState<number | null>(null);
    const MAX_VISIBILITY = 3;
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const openViewer = (i: number) => setViewerIndex(i);
    const closeViewer = () => setViewerIndex(null);

    // Auto-play interval
    useEffect(() => {
        if (viewerIndex === null && IMAGES.length > 0) {
            intervalRef.current = setInterval(() => {
                setActive((prev) => (prev + 1) % IMAGES.length);
            }, 4000); // changes every 4 seconds
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [viewerIndex]);

    // Lock body scroll when fullscreen is open
    useEffect(() => {
        if (viewerIndex !== null) {
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = "";
            };
        }
    }, [viewerIndex]);

    // Keyboard navigation
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (viewerIndex === null) return;
            if (e.key === "Escape") closeViewer();
            if (e.key === "ArrowLeft")
                setViewerIndex((i) => (i !== null && i > 0 ? i - 1 : i));
            if (e.key === "ArrowRight")
                setViewerIndex((i) =>
                    i !== null && i < IMAGES.length - 1 ? i + 1 : i,
                );
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [viewerIndex]);

    if (IMAGES.length === 0)
        return (
            <div className="w-full py-10 text-center text-pink-300 font-bold border-2 border-dashed border-pink-200 rounded-3xl">
                Please add images to public/images/carousel/
            </div>
        );

    return (
        <>
            {/* 3D Stack Container */}
            <div className="relative w-[14rem] h-[18rem] sm:w-[16rem] sm:h-[21rem] lg:w-[30rem] lg:h-[32rem] perspective-[1000px] flex items-center justify-center">
                {/* Left Arrow */}
                {active > 0 && (
                    <button
                        onClick={() => setActive((i) => i - 1)}
                        className="absolute -left-6 md:-left-10 top-1/2 -translate-y-1/2 z-40 p-2 rounded-full bg-white/90 hover:bg-white backdrop-blur-md text-rose-500 shadow-lg shadow-pink-200/50 border-2 border-pink-100 transition-transform hover:scale-110"
                    >
                        <Icon
                            icon="solar:alt-arrow-left-bold-duotone"
                            className="w-6 h-6"
                        />
                    </button>
                )}

                {/* Pure CSS Animated Cards */}
                <div className="relative w-full h-full z-50">
                    {IMAGES.map((src, i) => {
                        const isActiveSlide = i === active;
                        const offset = (active - i) / 3;
                        const absOffset = Math.abs(offset);
                        const direction = Math.sign(active - i);

                        // Math for the CSS transforms
                        const scale = isActiveSlide ? 1 : 1 - absOffset * 0.2;
                        const x = isActiveSlide ? 0 : -(direction * 60);
                        const opacity = absOffset >= MAX_VISIBILITY ? 0 : 1;
                        const blur = isActiveSlide ? 0 : absOffset * 0.4;

                        return (
                            <div
                                key={i}
                                className="absolute top-0 left-0 w-full h-full origin-center transition-all duration-500 ease-out"
                                style={{
                                    zIndex: isActiveSlide
                                        ? 30
                                        : 20 - Math.abs(i - active),
                                    pointerEvents: isActiveSlide
                                        ? "auto"
                                        : "none",
                                    transform: `translateX(${x}px) scale(${scale})`,
                                    opacity: opacity,
                                    filter: `blur(${blur}rem)`,
                                }}
                            >
                                <img
                                    src={src}
                                    alt="Carousel item"
                                    className={`w-full h-full object-cover rounded-[1.5rem] cursor-pointer select-none transition-shadow duration-300 ${
                                        isActiveSlide
                                            ? "shadow-[0_10px_30px_rgba(244,114,182,0.4)] border-4 border-white"
                                            : "shadow-lg border-2 border-white/50"
                                    }`}
                                    draggable={false}
                                    onClick={() => openViewer(i)}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Right Arrow */}
                {active < IMAGES.length - 1 && (
                    <button
                        onClick={() => setActive((i) => i + 1)}
                        className="absolute -right-6 md:-right-10 top-1/2 -translate-y-1/2 z-40 p-2 rounded-full bg-white/90 hover:bg-white backdrop-blur-md text-rose-500 shadow-lg shadow-pink-200/50 border-2 border-pink-100 transition-transform hover:scale-110"
                    >
                        <Icon
                            icon="solar:alt-arrow-right-bold-duotone"
                            className="w-6 h-6"
                        />
                    </button>
                )}
            </div>

            {/* LIGHTWEIGHT FULLSCREEN VIEWER - TELEPORTED TO BODY! */}
            {viewerIndex !== null &&
                typeof document !== "undefined" &&
                createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center ">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-rose-950/80 backdrop-blur-md"
                            onClick={closeViewer}
                        />

                        <button
                            onClick={closeViewer}
                            className="absolute top-6 right-6 md:top-8 md:right-8 p-2 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-lg shadow-lg transition-transform hover:rotate-90 hover:scale-110 z-50"
                        >
                            <Icon
                                icon="solar:close-circle-bold-duotone"
                                className="w-8 h-8 md:w-10 md:h-10"
                            />
                        </button>

                        {viewerIndex > 0 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setViewerIndex(viewerIndex - 1);
                                }}
                                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-lg transition-transform hover:-translate-x-2 z-50"
                            >
                                <Icon
                                    icon="solar:alt-arrow-left-bold-duotone"
                                    className="w-8 h-8 md:w-10 md:h-10"
                                />
                            </button>
                        )}

                        {viewerIndex < IMAGES.length - 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setViewerIndex(viewerIndex + 1);
                                }}
                                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-lg transition-transform hover:translate-x-2 z-50"
                            >
                                <Icon
                                    icon="solar:alt-arrow-right-bold-duotone"
                                    className="w-8 h-8 md:w-10 md:h-10"
                                />
                            </button>
                        )}

                        {/* View Image */}
                        <div className="relative z-40 animate-in zoom-in-95 duration-300">
                            <img
                                src={IMAGES[viewerIndex]}
                                className="max-h-[85svh] max-w-[90vw] rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-4 border-white/20 select-none"
                                alt="Fullscreen view"
                            />
                        </div>
                    </div>,
                    document.body, // <-- This forces the viewer out to the top layer of the DOM!
                )}
        </>
    );
}
