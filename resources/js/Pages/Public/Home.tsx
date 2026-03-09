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

            <div className="w-full py-6 md:py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Reduced gap-20 to gap-10 for a much more compact feel */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 w-full max-w-7xl mx-auto items-center">

                    {/* LEFT COLUMN: Welcome & Actions */}
                    <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6 w-full px-4 lg:px-0">

                        {/* Welcome Header with Lottie on the Right */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
                            <div className="flex flex-col items-center md:items-start space-y-4 flex-1 z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full font-potta text-[10px] uppercase tracking-widest border border-rose-100 shadow-sm">
                                    <Icon icon="solar:stars-bold-duotone" className="w-3 h-3 text-rose-500" />
                                    Municipal Portal
                                </div>

                                <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-serif font-black text-slate-800 tracking-tight leading-[1.1]">
                                    Hello, <br className="hidden md:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">
                                        Reader!
                                    </span> ✨
                                </h1>

                                <p className="max-w-md text-stone-500 font-medium text-sm leading-relaxed">
                                    Explore the Gerona Municipal Library. Your next adventure in learning starts right here.
                                </p>
                            </div>

                            {/* Compact Lottie Container: using negative margins to pull it closer and remove dead space */}
                            <div className="w-40 h-40 md:w-56 md:h-56 shrink-0 flex items-center justify-center -mt-4 -mb-8 md:-my-10 md:-mr-6">
                                <Lottie
                                    animationData={readingAnimation}
                                    loop={true}
                                    className="w-full h-full scale-110 object-contain"
                                />
                            </div>
                        </div>

                        {/* Action Grid: Catalog + Stacked Secondary Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Primary Action: Browse Catalog */}
                            <Link
                                href={route("catalog.index")}
                                className="h-full min-h-[200px] bg-gradient-to-br from-white to-rose-50 p-6 md:p-8 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md group relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-rose-300"
                            >
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-rose-100 flex items-center justify-center mb-5 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300">
                                        <Icon icon="solar:magnifer-bold-duotone" className="w-6 h-6 text-rose-500" />
                                    </div>
                                    <h2 className="text-2xl font-serif font-black text-slate-800 mb-1.5 group-hover:text-rose-600 transition-colors">
                                        Browse Catalog
                                    </h2>
                                    <p className="text-stone-500 text-xs md:text-sm max-w-[14rem] leading-relaxed">
                                        Access physical books and digital modules instantly.
                                    </p>
                                </div>
                                <Icon icon="solar:book-bookmark-bold-duotone" className="absolute -right-4 -bottom-4 w-32 h-32 text-rose-500 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
                            </Link>

                            {/* Stacked Secondary Actions: Print & Register */}
                            {/* Around line 92 in Home.tsx - Update these two SecondaryActionCards */}
                            <div className="flex flex-col gap-4 justify-between h-full">
                                <SecondaryActionCard
                                    href={route("print.index")} // Changed from print-station.index
                                    icon="solar:printer-bold-duotone"
                                    title="Print Station"
                                    description="Document printing services"
                                    theme="fuchsia"
                                />

                                <SecondaryActionCard
                                    href={route("register.index")} // Changed from register-patron.index
                                    icon="solar:card-2-bold-duotone"
                                    title="Get a Card"
                                    description="Become a library member"
                                    theme="amber"
                                />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Carousel */}
                    <div className="lg:col-span-5 xl:col-span-4 w-full px-4 flex flex-col justify-center">
                        <div className="w-full h-[250px] md:h-[320px] lg:h-[350px] flex items-center justify-center">
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
    // Matching the standard border colors and hover states from your other files
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
            className={`flex items-center gap-4 p-5 bg-white rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md group flex-1 ${themeStyles[theme]}`}
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