// resources/js/Pages/Public/Home.tsx
import { Head, Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { Icon } from "@iconify/react";
import Carousel from "@/Components/Public/Carousel";
import Lottie from "lottie-react";
import readingAnimation from "@/assets/lottie/reading-book.json";

export default function Home() {
    return (
        <PublicLayout>
            <Head title="Welcome to Gerona Library" />

            <div className="w-full py-2 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Main Grid:
                    Uses items-stretch to balance the left content and right carousel. 
                    Gap scales from 6 on mobile to 10 on desktop.
                */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 w-full items-stretch">

                    {/* LEFT COLUMN: Welcome & Actions */}
                    <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6 w-full">

                        {/* Welcome Header Container */}
                        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 bg-rose-50/30 p-6 md:p-8 rounded-3xl border border-rose-100 shadow-sm relative overflow-hidden">

                            {/* Text Area */}
                            <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3 z-10 flex-1">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-rose-600 rounded-full font-potta text-[10px] uppercase tracking-widest border border-rose-100 shadow-sm">
                                    <Icon icon="solar:stars-bold-duotone" className="w-3 h-3 text-rose-500" />
                                    Gerona Municipal Library
                                </div>

                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-slate-800 tracking-tight leading-[1.15]">
                                    Welcome, <br className="hidden md:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">
                                        Geronians Reader!
                                    </span>
                                </h1>

                                <p className="max-w-md text-stone-500 font-medium text-sm leading-relaxed mt-2">
                                    Explore the Gerona Municipal Library. A place for learning, discovery, and community.
                                </p>
                            </div>

                            {/* Lottie Container: 
                                Sits on top for mobile, aligns to the right for desktop. 
                            */}
                            <div className="w-32 h-32 md:w-48 md:h-48 shrink-0 flex items-center justify-center">
                                <Lottie
                                    animationData={readingAnimation}
                                    loop={true}
                                    className="w-full h-full scale-110 object-contain"
                                />
                            </div>
                        </div>

                        {/* Action Grid: Catalog + Stacked Secondary Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">

                            {/* Primary Action: Browse Catalog */}
                            <Link
                                href={route("catalog.index")}
                                className="h-full min-h-[200px] bg-gradient-to-br from-white to-rose-50 p-6 md:p-8 rounded-3xl border border-rose-100 shadow-sm hover:shadow-md group relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-rose-300"
                            >
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-rose-100 flex items-center justify-center mb-5 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300">
                                        <Icon icon="solar:magnifer-bold-duotone" className="w-6 h-6 text-rose-500" />
                                    </div>
                                    <h2 className="text-2xl font-serif font-black text-slate-800 mb-1.5 group-hover:text-rose-600 transition-colors">
                                        Browse Catalog
                                    </h2>
                                    <p className="text-stone-500 text-sm max-w-[14rem] leading-relaxed">
                                        Access physical books and digital modules instantly.
                                    </p>
                                </div>
                                <Icon icon="solar:book-bookmark-bold-duotone" className="absolute -right-4 -bottom-4 w-32 h-32 text-rose-500 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
                            </Link>

                            {/* Stacked Secondary Actions: Print & Register */}
                            <div className="flex flex-col gap-4 justify-between h-full">
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
                    <div className="lg:col-span-5 xl:col-span-4 w-full flex flex-col items-center justify-center h-full">
                        <div className="w-full h-[250px] sm:h-[350px] lg:h-full min-h-[300px] flex items-center justify-center rounded-3xl overflow-hidden relative border border-pink-100 shadow-sm">
                            <Carousel />
                        </div>
                        <p className="mt-4 text-center text-xs text-stone-400 font-medium tracking-wide uppercase">
                            <Icon icon="solar:gallery-wide-bold-duotone" className="inline w-4 h-4 mr-1.5 -mt-0.5" />
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
        fuchsia: "hover:bg-fuchsia-50/40 border-fuchsia-100 hover:border-fuchsia-300",
        amber: "hover:bg-amber-50/40 border-amber-100 hover:border-amber-300",
    };

    const iconColors = {
        fuchsia: "text-fuchsia-500 bg-fuchsia-50 border-fuchsia-100",
        amber: "text-amber-500 bg-amber-50 border-amber-100",
    };

    return (
        <Link
            href={href}
            className={`flex items-center gap-4 p-5 bg-white rounded-3xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md group flex-1 ${themeStyles[theme]}`}
        >
            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 ${iconColors[theme]}`}>
                <Icon icon={icon} className="w-6 h-6" />
            </div>

            <div className="flex-1">
                <h3 className="text-lg font-serif font-black text-slate-800 leading-tight mb-0.5 group-hover:text-slate-900">
                    {title}
                </h3>
                <p className="text-stone-500 text-xs">
                    {description}
                </p>
            </div>

            <Icon icon="solar:arrow-right-bold-duotone" className="w-5 h-5 text-stone-300 group-hover:text-slate-800 transition-colors group-hover:translate-x-1" />
        </Link>
    );
}