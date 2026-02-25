import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import RegisterModal from "@/Components/Public/Modals/RegisterModal";
import PrintModal from "@/Components/Public/Modals/PrintModal";
import Footer from "@/Components/Public/Footer";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isRegisterOpen, setRegisterOpen] = useState(false);
    const [isPrintOpen, setPrintOpen] = useState(false);
    const { url } = usePage();

    // Exact matches for Home vs Catalog
    const isHome = url === "/";
    const isCatalog = url.startsWith("/catalog");

    return (
        <div className="min-h-screen bg-[#FFF0F5] font-sans text-stone-800 relative flex flex-col overflow-x-hidden selection:bg-pink-200">
            {/* Injecting Potta One Font directly so it works instantly! */}
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Potta+One&display=swap');
                    .font-potta { font-family: 'Potta One', system-ui, sans-serif; }
                `}
            </style>

            {/* Background Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-200/40 rounded-full blur-3xl pointer-events-none z-0"></div>
            <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[50%] bg-rose-200/30 rounded-full blur-3xl pointer-events-none z-0"></div>

            {/* ================= THE BOOKMARK LOGO ================= */}
            <Link
                href="/"
                className="absolute top-0 left-4 md:left-6 bg-rose-500 text-white px-3 md:px-5 py-3 md:py-4 rounded-b-[1.2rem] md:rounded-b-[1.5rem] shadow-lg shadow-pink-300/50 border-2 border-t-0 border-pink-200 z-50 flex flex-col items-center group transition-all duration-300 hover:pt-6 hover:pb-5"
                title="Library Home"
            >
                <Icon
                    icon="fluent-emoji:books"
                    className="w-6 h-6 md:w-8 md:h-8 mb-1 group-hover:-rotate-12 transition-transform"
                />
                <span className="font-potta text-[9px] md:text-[11px] uppercase tracking-wider leading-none mt-1">
                    Library
                </span>
            </Link>

            {/* ================= MAIN CONTENT AREA ================= */}
            <div className="max-w-[100rem] mx-auto w-full flex-1 flex flex-col pt-16 md:pt-20 px-4 md:px-8 relative z-10 pb-4 md:pb-6">
                {/* 4 HORIZONTAL FOLDER TABS */}
                {/* Moved to the left using pl-20 md:pl-24 so it sits right next to the bookmark */}
                <div className="flex flex-row space-x-1.5 md:space-x-2 items-end z-20 pl-20 md:pl-5 no-scrollbar overflow-x-auto pr-4">
                    {/* 1. HOME TAB (Rose Color) */}
                    <Link
                        href="/"
                        className={`flex items-center justify-center gap-1.5 px-4 md:px-6 py-2.5 md:py-3.5 rounded-t-xl md:rounded-t-2xl border-2 border-b-0 relative translate-y-[2px] transition-all duration-300 min-w-max ${
                            isHome
                                ? "bg-gradient-to-b from-rose-400 to-rose-500 text-white border-rose-200 z-20 pb-4 md:pb-5 shadow-[0_-4px_12px_rgba(244,114,182,0.4)]"
                                : "bg-rose-100/80 text-rose-500 hover:bg-white hover:text-rose-600 border-transparent hover:border-rose-200 z-10 hover:-translate-y-1 hover:pb-4 hover:shadow-[0_-4px_12px_rgba(251,207,232,0.6)]"
                        }`}
                    >
                        <Icon
                            icon="solar:home-smile-bold-duotone"
                            className="w-4 h-4 md:w-5 md:h-5"
                        />
                        <span className="font-potta text-[10px] md:text-[12px] tracking-wider uppercase mt-0.5">
                            Home
                        </span>
                    </Link>

                    {/* 2. CATALOG TAB (Pink Color) */}
                    <Link
                        href={route("catalog.index")}
                        className={`flex items-center justify-center gap-1.5 px-4 md:px-6 py-2.5 md:py-3.5 rounded-t-xl md:rounded-t-2xl border-2 border-b-0 relative translate-y-[2px] transition-all duration-300 min-w-max ${
                            isCatalog
                                ? "bg-gradient-to-b from-pink-400 to-pink-500 text-white border-pink-200 z-20 pb-4 md:pb-5 shadow-[0_-4px_12px_rgba(244,114,182,0.4)]"
                                : "bg-pink-100/80 text-pink-500 hover:bg-white hover:text-pink-600 border-transparent hover:border-pink-200 z-10 hover:-translate-y-1 hover:pb-4 hover:shadow-[0_-4px_12px_rgba(251,207,232,0.6)]"
                        }`}
                    >
                        <Icon
                            icon="solar:magnifer-bold-duotone"
                            className="w-4 h-4 md:w-5 md:h-5"
                        />
                        <span className="font-potta text-[10px] md:text-[12px] tracking-wider uppercase mt-0.5">
                            Catalog
                        </span>
                    </Link>

                    {/* 3. PRINT STATION TAB (Fuchsia Color) */}
                    <button
                        onClick={() => setPrintOpen(true)}
                        className="flex items-center justify-center gap-1.5 px-3 md:px-5 py-2 md:py-3 rounded-t-lg md:rounded-t-xl border-2 border-b-0 border-transparent relative z-10 translate-y-[2px] transition-all duration-300 min-w-max bg-fuchsia-100/80 text-fuchsia-500 hover:bg-white hover:text-fuchsia-600 hover:border-fuchsia-200 hover:-translate-y-1 hover:pb-3 md:hover:pb-4 hover:shadow-[0_-4px_12px_rgba(251,207,232,0.6)]"
                    >
                        <Icon
                            icon="solar:printer-minimalistic-bold-duotone"
                            className="w-4 h-4 md:w-4 md:h-4"
                        />
                        <span className="font-potta text-[9px] md:text-[11px] tracking-wider uppercase mt-0.5">
                            Print
                        </span>
                    </button>

                    {/* 4. REGISTER TAB (Amber Color) */}
                    <button
                        onClick={() => setRegisterOpen(true)}
                        className="flex items-center justify-center gap-1.5 px-3 md:px-5 py-2 md:py-3 rounded-t-lg md:rounded-t-xl border-2 border-b-0 border-transparent relative z-10 translate-y-[2px] transition-all duration-300 min-w-max bg-amber-100/80 text-amber-600 hover:bg-white hover:text-amber-600 hover:border-amber-200 hover:-translate-y-1 hover:pb-3 md:hover:pb-4 hover:shadow-[0_-4px_12px_rgba(251,207,232,0.6)]"
                    >
                        <Icon
                            icon="solar:star-fall-bold-duotone"
                            className="w-4 h-4 md:w-4 md:h-4"
                        />
                        <span className="font-potta text-[9px] md:text-[11px] tracking-wider uppercase mt-0.5">
                            Register
                        </span>
                    </button>
                </div>

                {/* FOLDER BODY & FOOTER CONTAINER */}
                <div className="w-full relative z-10 flex flex-col">
                    {/* The White Folder Paper
                        - Removed 'flex-1' so it hugs the content naturally instead of forcing a full screen height.
                        - Reverted to soft, beautiful drop shadows.
                    */}
                    <main className="bg-white rounded-3xl shadow-xl shadow-pink-200/50 border-2 border-pink-200 p-6 md:p-10 flex flex-col">
                        {children}
                    </main>

                    {/* The Cutesy Footer */}
                    <div className="mt-8 md:mt-10 mb-4">
                        <Footer />
                    </div>
                </div>
            </div>

            {/* ================= MODALS ================= */}
            <RegisterModal isOpen={isRegisterOpen} onClose={setRegisterOpen} />
            <PrintModal isOpen={isPrintOpen} onClose={setPrintOpen} />
        </div>
    );
}
