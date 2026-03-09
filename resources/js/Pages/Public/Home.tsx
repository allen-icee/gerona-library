// resources/js/Pages/Public/Home.tsx
import { Head, Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { Icon } from "@iconify/react";
import Carousel from "@/Components/Public/Carousel";

export default function Home() {
    return (
        <PublicLayout>
            <Head title="Welcome to Gerona Library" />

            <div className="w-full py-4 md:py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-2 w-full max-w-6xl mx-auto items-center">
                    <div className="flex flex-col gap-8 w-full max-w-200 mx-auto lg:ml-auto lg:mr-0 px-4 lg:px-0">
                        {/* 1. Welcome Text */}
                        <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-100 text-rose-600 rounded-full font-potta text-[10px] uppercase tracking-wider mb-4 border border-rose-200 shadow-sm">
                                <Icon icon="solar:stars-bold-duotone" className="w-4 h-4" />
                                Municipal Portal
                            </div>
                            <h1 className="text-5xl md:text-6xl font-serif font-black text-slate-800 tracking-tight leading-[1.05]">
                                Hello, <br className="hidden lg:block" />
                                <span className="text-rose-500">Reader!</span> ✨
                            </h1>
                            <p className="mt-4 text-stone-500 font-medium text-sm md:text-base leading-relaxed">
                                Welcome back to the Gerona Municipal Library. Your next great story or service is just a click away.
                            </p>
                        </div>

                        {/* 2. Action Cards (BENTO BOX GRID) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            <Link
                                href={route("catalog.index")}
                                className="sm:row-span-2 h-full w-full bg-gradient-to-br from-white to-rose-50/50 p-6 rounded-[2rem] border-2 border-pink-100 shadow-lg shadow-pink-200/20 group relative overflow-hidden flex flex-col justify-between transition-transform hover:-translate-y-1 hover:border-rose-300"
                            >
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-rose-100 flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
                                        <Icon icon="fluent-emoji:magnifying-glass-tilted-right" className="w-7 h-7" />
                                    </div>
                                    <h2 className="text-2xl font-serif font-black text-slate-800 mb-1 leading-tight">
                                        Browse <br /> Catalog
                                    </h2>
                                    <p className="text-stone-500 text-[11px] md:text-xs max-w-[10rem] leading-relaxed">
                                        Search our physical books and digital modules.
                                    </p>
                                </div>
                                <div className="mt-6 flex items-center gap-1.5 text-rose-500 font-black text-[10px] uppercase tracking-widest font-potta group-hover:translate-x-1 transition-transform">
                                    Start Searching <Icon icon="solar:arrow-right-bold" className="w-3.5 h-3.5" />
                                </div>
                                <Icon icon="fluent-emoji:books" className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform pointer-events-none" />
                            </Link>

                            {/* SECONDARY ACTION 1: PRINT STATION */}
                            <Link
                                href={route("print.index")}
                                className="w-full h-full bg-white p-4 md:p-5 rounded-[1.5rem] border-2 border-pink-100 shadow-sm hover:shadow-md shadow-pink-200/20 group text-left flex flex-col items-start gap-3 hover:border-fuchsia-200 transition-all hover:-translate-y-1"
                            >
                                <div className="w-10 h-10 bg-fuchsia-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform border border-fuchsia-100">
                                    <Icon icon="fluent-emoji:printer" className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-800 group-hover:text-fuchsia-600 transition-colors leading-tight">Print Station</h3>
                                    <p className="text-stone-400 text-[9px] mt-0.5">Upload documents</p>
                                </div>
                            </Link>

                            {/* SECONDARY ACTION 2: REGISTER CARD */}
                            <Link
                                href={route("register.index")}
                                className="w-full h-full bg-white p-4 md:p-5 rounded-[1.5rem] border-2 border-pink-100 shadow-sm hover:shadow-md shadow-pink-200/20 group text-left flex flex-col items-start gap-3 hover:border-amber-200 transition-all hover:-translate-y-1"
                            >
                                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform border border-amber-100">
                                    <Icon icon="fluent-emoji:star" className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-800 group-hover:text-amber-600 transition-colors leading-tight">Get a Card</h3>
                                    <p className="text-stone-400 text-[9px] mt-0.5">Official registration</p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="w-full flex justify-center lg:justify-start items-center relative z-[9999] px-4 lg:px-20">
                        <Carousel />
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}