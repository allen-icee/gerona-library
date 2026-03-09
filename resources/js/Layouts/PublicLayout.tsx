// resources/js/Layouts/PublicLayout.tsx
import { Link, usePage } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import Footer from "@/Components/Public/Footer";

interface Donation {
    id: number;
    donor_name: string;
    items_donated: string;
}

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { url, props } = usePage();
    const recentDonations = props.recentDonations as Donation[] | undefined;

    // Exact matches for highlighting active tabs
    const isHome = url === "/";
    const isCatalog = url.startsWith("/catalog");
    const isPrint = url.startsWith("/print-station");
    const isRegister = url.startsWith("/register");

    return (
        <div className="min-h-screen bg-[#FFF0F5] font-sans text-stone-800 relative flex flex-col overflow-x-hidden selection:bg-pink-200">
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Potta+One&display=swap');
                    .font-potta { font-family: 'Potta One', system-ui, sans-serif; }

                    @keyframes marquee-scroll {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .animate-marquee {
                        display: flex;
                        width: max-content;
                        animation: marquee-scroll 40s linear infinite;
                    }
                    .animate-marquee:hover {
                        animation-play-state: paused;
                    }
                `}
            </style>

            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-200/40 rounded-full blur-3xl pointer-events-none z-0"></div>
            <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[50%] bg-rose-200/30 rounded-full blur-3xl pointer-events-none z-0"></div>

            {/* FLOATING DONATION MARQUEE */}
            {recentDonations && recentDonations.length > 0 && (
                <div className="absolute top-0 left-0 w-full bg-pink-100/80 backdrop-blur-sm border-b border-pink-200 text-rose-800 overflow-hidden py-1.5 shadow-sm z-40 flex items-center">
                    <div className="animate-marquee cursor-default pl-32 md:pl-48">
                        {[1, 2].map((set) => (
                            <div key={set} className="flex items-center gap-12 px-6">
                                {recentDonations.map((donation) => (
                                    <div key={`${set}-${donation.id}`} className="flex items-center gap-2 whitespace-nowrap">
                                        <Icon icon="fluent-emoji:sparkling-heart" className="w-4 h-4" />
                                        <span className="font-semibold text-[11px] tracking-wider uppercase">
                                            Thank you <span className="text-rose-600 font-black">{donation.donor_name}</span> for donating <span className="underline decoration-1 underline-offset-2">{donation.items_donated}</span>!
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* THE BOOKMARK LOGO */}
            <Link
                href="/"
                className="absolute top-0 left-4 md:left-6 bg-rose-500 text-white px-3 md:px-5 py-3 md:py-4 rounded-b-[1.2rem] md:rounded-b-[1.5rem] shadow-lg shadow-pink-300/50 border-2 border-t-0 border-pink-200 z-50 flex flex-col items-center group transition-all duration-300 hover:pt-6 hover:pb-5"
                title="Library Home"
            >
                <Icon icon="fluent-emoji:books" className="w-6 h-6 md:w-8 md:h-8 mb-1 group-hover:-rotate-12 transition-transform" />
                <span className="font-potta text-[9px] md:text-[11px] uppercase tracking-wider leading-none mt-1">Library</span>
            </Link>

            {/* MAIN CONTENT AREA */}
            <div className="max-w-[100rem] mx-auto w-full flex-1 flex flex-col pt-16 md:pt-20 px-4 md:px-8 relative z-10 pb-4 md:pb-6">
                
                {/* 4 HORIZONTAL FOLDER TABS */}
                <div className="flex flex-row space-x-1.5 md:space-x-2 items-end z-20 pl-20 md:pl-5 no-scrollbar overflow-x-auto pr-4">
                    <Link
                        href="/"
                        className={`flex items-center justify-center gap-1.5 px-4 md:px-6 py-2.5 md:py-3.5 rounded-t-xl md:rounded-t-2xl border-2 border-b-0 relative translate-y-[2px] transition-all duration-300 min-w-max ${
                            isHome
                                ? "bg-gradient-to-b from-rose-400 to-rose-500 text-white border-rose-200 z-20 pb-4 md:pb-5 shadow-[0_-4px_12px_rgba(244,114,182,0.4)]"
                                : "bg-rose-100/80 text-rose-500 hover:bg-white hover:text-rose-600 border-transparent hover:border-rose-200 z-10 hover:-translate-y-1 hover:pb-4 hover:shadow-[0_-4px_12px_rgba(251,207,232,0.6)]"
                        }`}
                    >
                        <Icon icon="solar:home-smile-bold-duotone" className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="font-potta text-[10px] md:text-[12px] tracking-wider uppercase mt-0.5">Home</span>
                    </Link>

                    <Link
                        href={route("catalog.index")}
                        className={`flex items-center justify-center gap-1.5 px-4 md:px-6 py-2.5 md:py-3.5 rounded-t-xl md:rounded-t-2xl border-2 border-b-0 relative translate-y-[2px] transition-all duration-300 min-w-max ${
                            isCatalog
                                ? "bg-gradient-to-b from-pink-400 to-pink-500 text-white border-pink-200 z-20 pb-4 md:pb-5 shadow-[0_-4px_12px_rgba(244,114,182,0.4)]"
                                : "bg-pink-100/80 text-pink-500 hover:bg-white hover:text-pink-600 border-transparent hover:border-pink-200 z-10 hover:-translate-y-1 hover:pb-4 hover:shadow-[0_-4px_12px_rgba(251,207,232,0.6)]"
                        }`}
                    >
                        <Icon icon="solar:magnifer-bold-duotone" className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="font-potta text-[10px] md:text-[12px] tracking-wider uppercase mt-0.5">Catalog</span>
                    </Link>

                    <Link
                        href={route("print.index")}
                        className={`flex items-center justify-center gap-1.5 px-3 md:px-5 py-2 md:py-3 rounded-t-lg md:rounded-t-xl border-2 border-b-0 relative translate-y-[2px] transition-all duration-300 min-w-max ${
                            isPrint
                                ? "bg-gradient-to-b from-fuchsia-400 to-fuchsia-500 text-white border-fuchsia-200 z-20 pb-4 md:pb-5 shadow-[0_-4px_12px_rgba(217,70,239,0.4)]"
                                : "bg-fuchsia-100/80 text-fuchsia-500 hover:bg-white hover:text-fuchsia-600 border-transparent hover:border-fuchsia-200 z-10 hover:-translate-y-1 hover:pb-3 md:hover:pb-4 hover:shadow-[0_-4px_12px_rgba(251,207,232,0.6)]"
                        }`}
                    >
                        <Icon icon="solar:printer-minimalistic-bold-duotone" className="w-4 h-4 md:w-4 md:h-4" />
                        <span className="font-potta text-[9px] md:text-[11px] tracking-wider uppercase mt-0.5">Print</span>
                    </Link>

                    <Link
                        href={route("register.index")}
                        className={`flex items-center justify-center gap-1.5 px-3 md:px-5 py-2 md:py-3 rounded-t-lg md:rounded-t-xl border-2 border-b-0 relative translate-y-[2px] transition-all duration-300 min-w-max ${
                            isRegister
                                ? "bg-gradient-to-b from-amber-400 to-amber-500 text-amber-950 border-amber-200 z-20 pb-4 md:pb-5 shadow-[0_-4px_12px_rgba(251,191,36,0.4)]"
                                : "bg-amber-100/80 text-amber-600 hover:bg-white hover:text-amber-600 border-transparent hover:border-amber-200 z-10 hover:-translate-y-1 hover:pb-3 md:hover:pb-4 hover:shadow-[0_-4px_12px_rgba(251,207,232,0.6)]"
                        }`}
                    >
                        <Icon icon="solar:star-fall-bold-duotone" className="w-4 h-4 md:w-4 md:h-4" />
                        <span className="font-potta text-[9px] md:text-[11px] tracking-wider uppercase mt-0.5">Register</span>
                    </Link>
                </div>

                {/* FOLDER BODY & FOOTER CONTAINER */}
                <div className="w-full relative z-10 flex flex-col">
                    <main className="bg-white rounded-3xl shadow-xl shadow-pink-200/50 border-2 border-pink-200 p-6 md:p-10 flex flex-col min-h-[60vh]">
                        {children}
                    </main>

                    <div className="mt-8 md:mt-10 mb-4">
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    );
}