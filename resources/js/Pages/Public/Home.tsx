// resources/js/Pages/Public/Home.tsx
import { Head, Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { Icon } from "@iconify/react";
import Carousel from "@/Components/Public/Carousel";
import { ReactNode } from "react";

export default function Home() {
    return (
        <PublicLayout>
            <Head title="Welcome to Gerona Library" />

            <div className="w-full py-6 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 lg:gap-16 w-full max-w-7xl mx-auto items-center">
                    
                    {/* LEFT COLUMN: Text & Actions */}
                    <div className="xl:col-span-7 flex flex-col gap-10 w-full px-4 lg:px-0">
                        
                        {/* Welcome Header */}
                        <div className="text-center xl:text-left flex flex-col items-center xl:items-start space-y-5">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-full font-potta text-xs uppercase tracking-widest border border-rose-200/60 shadow-sm backdrop-blur-sm">
                                <Icon icon="solar:stars-bold-duotone" className="w-4 h-4 text-rose-500" />
                                Municipal Portal
                            </div>
                            
                            <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-black text-slate-800 tracking-tight leading-[1.1]">
                                Hello, <br className="hidden xl:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">
                                    Reader!
                                </span> ✨
                            </h1>
                            
                            <p className="max-w-xl text-stone-500 font-medium text-base md:text-lg leading-relaxed">
                                Welcome back to the Gerona Municipal Library. Your next great story, research material, or digital service is just a click away.
                            </p>
                        </div>

                        {/* Action Cards (Bento Grid) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-3xl mx-auto xl:mx-0">
                            
                            {/* Primary Action: Browse Catalog */}
                            <Link
                                href={route("catalog.index")}
                                className="sm:row-span-2 sm:col-span-1 h-full min-h-[280px] w-full bg-gradient-to-br from-white to-rose-50 p-8 rounded-[2rem] border-2 border-pink-100/80 shadow-xl shadow-rose-200/20 group relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-rose-200/40 hover:border-rose-300"
                            >
                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-rose-100 flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                                        <Icon icon="fluent-emoji:magnifying-glass-tilted-right" className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-3xl font-serif font-black text-slate-800 mb-3 leading-tight">
                                        Browse <br /> Catalog
                                    </h2>
                                    <p className="text-stone-500 text-sm max-w-[12rem] leading-relaxed mb-6">
                                        Search our physical books and digital learning modules.
                                    </p>
                                    
                                    <div className="mt-auto flex items-center gap-2 text-rose-500 font-black text-xs uppercase tracking-widest font-potta group-hover:translate-x-2 transition-transform duration-300">
                                        Start Searching <Icon icon="solar:arrow-right-bold" className="w-4 h-4" />
                                    </div>
                                </div>
                                {/* Decorative Background Icon */}
                                <Icon icon="fluent-emoji:books" className="absolute -right-8 -bottom-8 w-48 h-48 opacity-5 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 pointer-events-none" />
                            </Link>

                            {/* Secondary Actions */}
                            <div className="flex flex-col gap-5 sm:col-span-1">
                                <SecondaryActionCard
                                    href={route("print.index")}
                                    icon="fluent-emoji:printer"
                                    title="Print Station"
                                    description="Upload & print documents"
                                    theme="fuchsia"
                                />
                                
                                <SecondaryActionCard
                                    href={route("register.index")}
                                    icon="fluent-emoji:star"
                                    title="Get a Card"
                                    description="Apply for a library card"
                                    theme="amber"
                                />
                            </div>

                        </div>
                    </div>

                    {/* RIGHT COLUMN: Visuals (Lottie + Carousel) */}
                    <div className="xl:col-span-5 w-full flex flex-col items-center justify-center gap-8 relative z-[9999] px-4">
                        
                        {/* =========================================
                            LOTTIE ANIMATION SLOT 
                            Recommendation: Use `lottie-react`
                            npm install lottie-react
                            Example: <Lottie animationData={readingAnimation} loop={true} className="w-64 h-64" />
                        ========================================= */}
                        <div className="w-full max-w-sm aspect-video sm:aspect-square xl:aspect-auto xl:h-64 bg-gradient-to-tr from-rose-50 to-pink-50/50 rounded-[2rem] border-2 border-dashed border-rose-200 flex flex-col items-center justify-center text-rose-400 p-8 text-center relative overflow-hidden group hover:border-rose-300 transition-colors">
                            <Icon icon="solar:magic-stick-3-bold-duotone" className="w-12 h-12 mb-3 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 text-rose-400" />
                            <span className="text-base font-bold text-rose-500 mb-1">Lottie Animation Slot</span>
                            <span className="text-sm font-medium opacity-80 max-w-[200px]">
                                Replace this container with your Lottie player component.
                            </span>
                        </div>

                        {/* Carousel Wrapper */}
                        <div className="w-full max-w-sm xl:max-w-full rounded-[2rem] overflow-hidden shadow-2xl shadow-rose-900/10 border-4 border-white">
                            <Carousel />
                        </div>

                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

// --- Subcomponents ---
// Extracted to keep the main component clean. You can move this to a separate file later if reused.

interface SecondaryActionCardProps {
    href: string;
    icon: string;
    title: string;
    description: string;
    theme: 'fuchsia' | 'amber' | 'rose';
}

function SecondaryActionCard({ href, icon, title, description, theme }: SecondaryActionCardProps) {
    const themeStyles = {
        fuchsia: "hover:border-fuchsia-300 hover:shadow-fuchsia-200/40 text-fuchsia-600 bg-fuchsia-50 border-fuchsia-100",
        amber: "hover:border-amber-300 hover:shadow-amber-200/40 text-amber-600 bg-amber-50 border-amber-100",
        rose: "hover:border-rose-300 hover:shadow-rose-200/40 text-rose-600 bg-rose-50 border-rose-100",
    };

    return (
        <Link
            href={href}
            className={`w-full h-full min-h-[130px] bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-lg shadow-slate-200/20 group text-left flex flex-row sm:flex-col xl:flex-row items-center sm:items-start xl:items-center gap-5 transition-all duration-300 hover:-translate-y-1 ${themeStyles[theme].split(' ')[0]} ${themeStyles[theme].split(' ')[1]}`}
        >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 border ${themeStyles[theme].split(' ').slice(3).join(' ')}`}>
                <Icon icon={icon} className="w-7 h-7" />
            </div>
            <div className="flex-1">
                <h3 className={`text-lg font-black text-slate-800 group-hover:${themeStyles[theme].split(' ')[2]} transition-colors leading-tight mb-1`}>
                    {title}
                </h3>
                <p className="text-stone-500 text-xs md:text-sm leading-snug">
                    {description}
                </p>
            </div>
            
            {/* Arrow icon visible on hover for desktop */}
            <div className="hidden sm:block opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                <Icon icon="solar:alt-arrow-right-bold-duotone" className={`w-6 h-6 ${themeStyles[theme].split(' ')[2]}`} />
            </div>
        </Link>
    );
}