// resources/js/Components/Public/Modals/DevCreditModal.tsx

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/Components/ui/dialog";
import { Icon } from "@iconify/react";
import Lottie from "lottie-react";
import confettiAnimation from "@/assets/lottie/confetti.json";

export default function DevCreditModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: (open: boolean) => void;
}) {
    const [isImageZoomed, setIsImageZoomed] = useState(false);

    const coInterns = [
        { name: "Christian Jay C. Caones", link: "https://facebook.com/" },
        { name: "Ronjean F. David", link: "https://facebook.com/" },
        { name: "Elijah Miguel V. Inocencio", link: "https://facebook.com/" },
        { name: "Luke Reed Chard R. Mendoza", link: "https://facebook.com/" },
        { name: "Dean Mark Rei A. Villanueva", link: "https://facebook.com/" },
    ];

    return (
        <>
            {/* 1. CONFETTI FIX: Placed outside with an ultra-high z-index to guarantee it overlays the Portal */}
            {isOpen && (
                <div className="fixed inset-0 z-[999999] pointer-events-none flex items-center justify-center">
                    <Lottie
                        animationData={confettiAnimation}
                        loop={false}
                        className="w-full h-full object-cover scale-110"
                    />
                </div>
            )}

            <Dialog open={isOpen} onOpenChange={(open) => {
                onClose(open);
                if (!open) setIsImageZoomed(false);
            }}>
                {/* 2. SOLID THEME & CUSTOM CLOSE BUTTON: Removed glass effect, added floating rounded close button */}
                <DialogContent className="bg-white border-4 border-rose-100 rounded-[2rem] sm:max-w-[750px] w-[95vw] p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto hide-scrollbar [&>button]:absolute [&>button]:right-4 [&>button]:top-4 [&>button]:bg-white [&>button]:text-rose-500 [&>button]:p-2 [&>button]:rounded-full [&>button]:shadow-md hover:[&>button]:bg-rose-50 hover:[&>button]:scale-110 [&>button]:transition-all [&>button]:border [&>button]:border-rose-100 [&>button]:z-50 [&>button>svg]:w-5 [&>button>svg]:h-5">

                    <DialogDescription className="sr-only">
                        Information about the project team and MIS interns behind the system.
                    </DialogDescription>

                    {/* TEAM PICTURE SECTION */}
                    <div
                        onClick={() => setIsImageZoomed(true)}
                        className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-sm border border-rose-100 mb-6 group cursor-zoom-in"
                    >
                        <img
                            src="/images/dev-team.jpg"
                            alt="MIS Internship Team"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://placehold.co/800x350/ffe4e6/f43f5e?text=Insert+Team+Photo+Here";
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center pb-3 opacity-90">
                            <span className="text-white font-black tracking-[0.3em] uppercase text-xs drop-shadow-md flex items-center gap-1.5">
                                <Icon icon="solar:diploma-verified-bold-duotone" className="w-5 h-5 text-rose-300" />
                                Class of 2026
                            </span>
                        </div>
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="bg-white/90 backdrop-blur-sm text-rose-600 px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                <Icon icon="solar:maximize-square-minimalistic-bold-duotone" className="w-4 h-4" />
                                Click to Expand
                            </div>
                        </div>
                    </div>

                    {/* HEADER */}
                    <DialogHeader className="mb-6 mt-2">
                        <DialogTitle className="text-3xl md:text-4xl font-serif font-black text-slate-800 flex items-center justify-center gap-3">
                            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center shadow-sm border border-rose-100">
                                <Icon icon="solar:users-group-two-rounded-bold-duotone" className="w-7 h-7" />
                            </div>
                            The Project Team
                        </DialogTitle>
                        <p className="text-sm md:text-base text-stone-500 font-medium text-center mt-2 px-4">
                            Developed, designed, and digitized for the Gerona Municipal Library.
                        </p>
                    </DialogHeader>

                    {/* CREDITS GRID */}
                    <div className="space-y-4 text-left">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* LEAD DEVELOPER */}
                            <a
                                href="https://facebook.com/"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-tr from-[#FD1D1D]/5 to-[#833AB4]/5 text-[#C13584] border border-[#C13584]/20 hover:from-[#FD1D1D] hover:to-[#833AB4] hover:border-transparent hover:text-white transition-all duration-300 group shadow-sm hover:shadow-md hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center text-inherit shadow-sm shrink-0 group-hover:rotate-6 transition-transform">
                                    <Icon icon="solar:keyboard-bold-duotone" className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] md:text-xs uppercase tracking-widest font-bold mb-0.5 opacity-70 group-hover:text-white">Lead Developer</p>
                                    <p className="font-black text-sm md:text-base">Allen Icee A. Dequiros</p>
                                </div>
                            </a>

                            {/* SUPERVISOR */}
                            <a
                                href="https://facebook.com/"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-tr from-[#FD1D1D]/5 to-[#833AB4]/5 text-[#C13584] border border-[#C13584]/20 hover:from-[#FD1D1D] hover:to-[#833AB4] hover:border-transparent hover:text-white transition-all duration-300 group shadow-sm hover:shadow-md hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center text-inherit shadow-sm shrink-0 group-hover:-rotate-6 transition-transform">
                                    <Icon icon="solar:user-id-bold-duotone" className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-black text-sm md:text-base">Kathlyn Ann Cadavero Asuit</p>
                                </div>
                            </a>

                        </div>

                        {/* CO-INTERNS */}
                        <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-4 text-[#C13584]">
                                <Icon icon="solar:users-group-two-rounded-bold-duotone" className="w-6 h-6" />
                                <p className="text-xs uppercase tracking-widest font-bold">Members</p>
                            </div>

                            <div className="flex flex-wrap gap-2.5">
                                {coInterns.map((intern, idx) => (
                                    <a
                                        key={idx}
                                        href={intern.link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-4 py-2 rounded-xl bg-gradient-to-tr from-[#FD1D1D]/10 to-[#833AB4]/10 text-[#C13584] border border-[#C13584]/20 font-bold text-xs md:text-sm hover:from-[#FD1D1D] hover:to-[#833AB4] hover:border-transparent hover:text-white transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                                    >
                                        {intern.name}
                                    </a>
                                ))}
                            </div>
                        </div>

                    </div>
                </DialogContent>
            </Dialog>

            {/* FULL SCREEN IMAGE LIGHTBOX */}
            {isImageZoomed && (
                <div
                    className="fixed inset-0 z-[999999] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10 cursor-zoom-out animate-in fade-in duration-300"
                    onClick={() => setIsImageZoomed(false)}
                >
                    <div className="relative max-w-6xl w-full h-full flex flex-col items-center justify-center">
                        <img
                            src="/images/dev-team.jpg"
                            alt="MIS Internship Team Full View"
                            className="w-auto h-auto max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain animate-in zoom-in-95 duration-300 border-4 border-white/10"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://placehold.co/1200x800/1e293b/f43f5e?text=Insert+Team+Photo+Here";
                            }}
                        />
                        <p className="text-white/60 font-bold text-sm tracking-widest uppercase mt-6">
                            Click anywhere to close
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}