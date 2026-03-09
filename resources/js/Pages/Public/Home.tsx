// resources/js/Pages/Public/Home.tsx
import { Head, Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { Icon } from "@iconify/react";
import Carousel from "@/Components/Public/Carousel";

// 1. Import the Lottie component and your JSON file
import Lottie from "lottie-react";
import readingAnimation from "@/assets/lottie/reading-book.json";

export default function Home() {
    return (
        <PublicLayout>
            <Head title="Welcome to Gerona Library" />

            <div className="w-full py-6 md:py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-20 w-full max-w-7xl mx-auto items-center">
                    
                    {/* LEFT COLUMN: Welcome & Actions */}
                    <div className="xl:col-span-8 flex flex-col gap-8 w-full px-4 lg:px-0">
                        
                        {/* Welcome Header with Lottie on the Right */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/40 p-6 rounded-[2.5rem] border border-rose-100/50">
                            <div className="flex flex-col items-center md:items-start space-y-4 flex-1">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full font-potta text-[10px] uppercase tracking-widest border border-rose-200/60 shadow-sm">
                                    <Icon icon="solar:stars-bold-duotone" className="w-3 h-3 text-rose-500" />
                                    Municipal Portal
                                </div>
                                
                                {/* Using a "Library" style serif font (Playfair Display or similar via font-serif) */}
                                <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-black text-slate-800 tracking-tight leading-[1.1]">
                                    Hello, <br className="hidden md:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">
                                        Reader!
                                    </span> ✨
                                </h1>
                                
                                <p className="max-w-md text-stone-500 font-medium text-sm md:text-base leading-relaxed">
                                    Explore the Gerona Municipal Library. Your next adventure in learning starts right here.
                                </p>
                            </div>

                            {/* Lottie Animation Slot - Fixed non-standard tailwind classes */}
                            <div className="w-48 h-48 md:w-64 md:h-64 shrink-0 flex items-center justify-center">
                                <Lottie 
                                    animationData={readingAnimation} 
                                    loop={true} 
                                    className="w-full h-full"
                                />
                            </div>
                        </div>

                        {/* Action Grid: Catalog + Stacked Secondary Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Primary Action: Browse Catalog */}
                            <Link
                                href={route("catalog.index")}
                                className="h-full min-h-[220px] bg-gradient-to-br from-white to-rose-50 p-8 rounded-[2rem] border-2 border-rose-100 shadow-xl shadow-rose-200/20 group relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-rose-300"
                            >
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-rose-100 flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                                        <Icon icon="solar:magnifer-bold-duotone" className="w-7 h-7 text-rose-500" />
                                    </div>
                                    <h2 className="text-3xl font-serif font-black text-slate-800 mb-2">Browse Catalog</h2>
                                    <p className="text-stone-500 text-sm max-w-[15rem]">Access physical books and digital modules instantly.</p>
                                </div>
                                {/* Iconify background decoration */}
                                <Icon icon="solar:library-bold-duotone" className="absolute -right-6 -bottom-6 w-40 h-40 opacity-5 group-hover:scale-110 transition-transform pointer-events-none" />
                            </Link>

                            {/* Stacked Secondary Actions: Print & Register */}
                            <div className="flex flex-col gap-4">
                                <SecondaryActionCard
                                    href={route("print.index")}
                                    icon="solar:printer-bold-duotone"
                                    title="Print Station"
                                    description="Document printing services"
                                    theme="fuchsia"
                                />
                                
                                <SecondaryActionCard
                                    href={route("register.index")}
                                    icon="solar:card-2-bold-duotone"
                                    title="Get a Card"
                                    description="Become a library member"
                                    theme="amber"
                                />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Carousel */}
                    <div className="xl:col-span-4 w-full px-4 flex flex-col justify-center">
                        {/* Removed the restrictive borders and overflow from this wrapper so the 3D effect pops out naturally */}
                        <div className="w-full h-[250px] md:h-[350px] flex items-center justify-center">
                            <Carousel />
                        </div>
                        <p className="mt-4 text-center text-xs text-stone-400 font-medium">
                            <Icon icon="solar:gallery-wide-bold-duotone" className="inline w-4 h-4 mr-1" />
                            Library Gallery
                        </p>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

// Compact Secondary Action Card Subcomponent
interface SecondaryActionCardProps {
    href: string;
    icon: string;
    title: string;
    description: string;
    theme: 'fuchsia' | 'amber';
}

function SecondaryActionCard({ href, icon, title, description, theme }: SecondaryActionCardProps) {
    const themeStyles = {
        fuchsia: "text-fuchsia-600 bg-fuchsia-50/50 border-fuchsia-100 hover:border-fuchsia-300",
        amber: "text-amber-600 bg-amber-50/50 border-amber-100 hover:border-amber-300",
    };

    return (
        <Link
            href={href}
            className={`flex items-center gap-5 p-5 bg-white rounded-3xl border-2 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${themeStyles[theme]}`}
        >
            <div className="w-12 h-12 rounded-2xl bg-white border border-inherit flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Icon icon={icon} className="w-6 h-6" />
            </div>
            <div className="flex-1">
                <h3 className="text-lg font-serif font-black text-slate-800 leading-tight">{title}</h3>
                <p className="text-stone-500 text-xs">{description}</p>
            </div>
            <Icon icon="solar:arrow-right-bold-duotone" className="w-5 h-5 opacity-30" />
        </Link>
    );
}