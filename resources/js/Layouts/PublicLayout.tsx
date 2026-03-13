// resources/js/Layouts/PublicLayout.tsx
import { Link, usePage } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import Footer from "@/Components/Public/Footer";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { url } = usePage();

    const isHome = url === "/";
    const isCatalog = url.startsWith("/catalog");
    const isPrint = url.startsWith("/print-station");
    const isRegister = url.startsWith("/get-card");

    return (
        // Using 100dvh ensures mobile browsers with URL bars don't cut off the footer or jump layout
        <div className="min-h-[100dvh] bg-[#FFF0F5] font-sans text-stone-800 relative flex flex-col overflow-x-hidden selection:bg-pink-200">

            {/* Background blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-200/40 rounded-full blur-3xl pointer-events-none z-0"></div>
            <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[50%] bg-rose-200/30 rounded-full blur-3xl pointer-events-none z-0"></div>

            {/* MAIN CONTENT AREA */}
            <div className="max-w-[100rem] mx-auto w-full flex flex-col flex-1 relative z-10 px-4 md:px-8">

                {/* BOOKMARK LOGO 
                    Moved inside the max-w container so it aligns perfectly with the content bounds. 
                */}
                <Link
                    href="/"
                    className="absolute top-0 left-4 md:left-8 bg-rose-500 text-white px-3 md:px-5 py-3 md:py-4 rounded-b-[1.2rem] md:rounded-b-[1.5rem] shadow-lg shadow-pink-300/50 border-2 border-t-0 border-pink-200 z-50 flex flex-col items-center group transition-all duration-300 hover:pt-6 hover:pb-5"
                    title="Library Home"
                >
                    <img
                        src="/images/GeronaLibraryLogo.png"
                        alt="Library Logo"
                        className="w-16 h-16 md:w-18 md:h-18 mb-1 group-hover:scale-110 transition-transform"
                    />
                    <span className="font-potta text-[9px] md:text-[11px] uppercase tracking-wider leading-none mt-1">
                        Library
                    </span>
                </Link>

                {/* FOLDER TABS */}
                {/* Fixed the overlap issue by replacing pl-20/pl-5 with pl-[6.5rem] (mobile) and pl-[9.5rem] (desktop) to safely clear the logo */}
                <div className="flex flex-row space-x-1.5 md:space-x-2 items-end z-20 overflow-x-auto no-scrollbar pr-4 pt-12 md:pt-16 pl-[6.5rem] sm:pl-[7.5rem] md:pl-[9.5rem] lg:pl-[10rem]">
                    <Link
                        href="/"
                        className={`flex items-center gap-1.5 px-4 md:px-6 py-2.5 md:py-3.5 rounded-t-xl md:rounded-t-2xl border-2 border-b-0 relative translate-y-[2px] transition-all duration-300 min-w-max ${isHome
                            ? "bg-gradient-to-b from-rose-400 to-rose-500 text-white border-rose-200 z-20 pb-4 md:pb-5 shadow-[0_-4px_12px_rgba(244,114,182,0.4)]"
                            : "bg-rose-100/80 text-rose-500 hover:bg-white hover:text-rose-600 border-transparent hover:border-rose-200 z-10 hover:-translate-y-1 hover:pb-4 hover:shadow-[0_-4px_12px_rgba(251,207,232,0.6)]"
                            }`}
                    >
                        <Icon icon="solar:home-smile-bold-duotone" className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="font-potta text-[10px] md:text-[12px] tracking-wider uppercase mt-0.5">
                            Home
                        </span>
                    </Link>

                    <Link
                        href={route("catalog.index")}
                        className={`flex items-center gap-1.5 px-4 md:px-6 py-2.5 md:py-3.5 rounded-t-xl md:rounded-t-2xl border-2 border-b-0 relative translate-y-[2px] transition-all duration-300 min-w-max ${isCatalog
                            ? "bg-gradient-to-b from-pink-400 to-pink-500 text-white border-pink-200 z-20 pb-4 md:pb-5 shadow-[0_-4px_12px_rgba(244,114,182,0.4)]"
                            : "bg-pink-100/80 text-pink-500 hover:bg-white hover:text-pink-600 border-transparent hover:border-pink-200 z-10 hover:-translate-y-1 hover:pb-4 hover:shadow-[0_-4px_12px_rgba(251,207,232,0.6)]"
                            }`}
                    >
                        <Icon icon="solar:magnifer-bold-duotone" className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="font-potta text-[10px] md:text-[12px] tracking-wider uppercase mt-0.5">
                            Catalog
                        </span>
                    </Link>

                    <Link
                        href={route("print.index")}
                        className={`flex items-center gap-1.5 px-3 md:px-5 py-2 md:py-3 rounded-t-lg md:rounded-t-xl border-2 border-b-0 relative translate-y-[2px] transition-all duration-300 min-w-max ${isPrint
                            ? "bg-gradient-to-b from-fuchsia-400 to-fuchsia-500 text-white border-fuchsia-200 z-20 pb-4 md:pb-5 shadow-[0_-4px_12px_rgba(217,70,239,0.4)]"
                            : "bg-fuchsia-100/80 text-fuchsia-500 hover:bg-white hover:text-fuchsia-600 border-transparent hover:border-fuchsia-200 z-10 hover:-translate-y-1 hover:pb-3 md:hover:pb-4 hover:shadow-[0_-4px_12px_rgba(251,207,232,0.6)]"
                            }`}
                    >
                        <Icon icon="solar:printer-minimalistic-bold-duotone" className="w-4 h-4" />
                        <span className="font-potta text-[9px] md:text-[11px] tracking-wider uppercase mt-0.5">
                            Print
                        </span>
                    </Link>

                    <Link
                        href={route("register.index")}
                        className={`flex items-center gap-1.5 px-3 md:px-5 py-2 md:py-3 rounded-t-lg md:rounded-t-xl border-2 border-b-0 relative translate-y-[2px] transition-all duration-300 min-w-max ${isRegister
                            ? "bg-gradient-to-b from-amber-400 to-amber-500 text-white border-amber-200 z-20 pb-4 md:pb-5 shadow-[0_-4px_12px_rgba(251,191,36,0.4)]"
                            : "bg-amber-100/80 text-amber-600 hover:bg-white hover:text-amber-600 border-transparent hover:border-amber-200 z-10 hover:-translate-y-1 hover:pb-3 md:hover:pb-4 hover:shadow-[0_-4px_12px_rgba(251,207,232,0.6)]"
                            }`}
                    >
                        <Icon icon="solar:star-fall-bold-duotone" className="w-4 h-4" />
                        <span className="font-potta text-[9px] md:text-[11px] tracking-wider uppercase mt-0.5">
                            Register
                        </span>
                    </Link>
                </div>

                {/* FOLDER BODY */}
                {/* Added pb-8 to account for the dynamic viewport height so footer breathes well */}
                <div className="w-full relative z-10 flex flex-col flex-1 pb-6 md:pb-8">
                    <main className="bg-white rounded-3xl shadow-xl shadow-pink-200/50 border-2 border-pink-200 p-4 sm:p-6 md:p-10 flex flex-col flex-1">
                        {children}
                    </main>

                    <Footer />
                </div>
            </div>
        </div>
    );
}