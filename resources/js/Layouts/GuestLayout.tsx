// resources/js/Layouts/GuestLayout.tsx

import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function GuestLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-stone-50 pt-6 sm:justify-center sm:pt-0 relative overflow-hidden font-sans">

            <div className="absolute top-[-10%] left-[-10%] w-120 h-120 bg-pink-200/30 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-120 h-120 bg-rose-200/30 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 text-center mb-6 mt-10 sm:mt-0 px-4">
                <Link href="/" className="flex flex-col items-center group">

                    <div className="flex flex-row items-center justify-center gap-4 md:gap-6 mb-3">

                        <img
                            src="/images/TSULogo.png"
                            alt="School Logo"
                            className="h-16 w-16 md:h-20 md:w-20 object-contain drop-shadow-sm hover:scale-105 transition-transform duration-300"
                            onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/100x100/fdf2f8/be185d?text=School"; }}
                        />

                        <img
                            src="/images/GeronaLibraryLogo.png"
                            alt="Gerona Library Logo"
                            className="h-20 w-20 md:h-24 md:w-24 object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
                            onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/120x120/fdf2f8/be185d?text=LGU"; }}
                        />

                        <img
                            src="/images/CCSLogo.png"
                            alt="Department Logo"
                            className="h-16 w-16 md:h-20 md:w-20 object-contain drop-shadow-sm hover:scale-105 transition-transform duration-300"
                            onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/100x100/fdf2f8/be185d?text=Dept"; }}
                        />
                    </div>

                    <h1 className="text-2xl md:text-3xl font-serif font-black text-slate-800 tracking-wide">
                        Gerona Municipal <span className="text-pink-500">Library</span>
                    </h1>
                </Link>
            </div>

            <div className="relative z-10 w-full overflow-hidden bg-white px-8 py-10 shadow-[0_8px_30px_rgb(225,29,72,0.06)] sm:max-w-md sm:rounded-[2.5rem] border border-pink-100">
                {children}
            </div>

            <div className="relative z-10 mt-8 text-xs text-stone-400 font-medium">
                &copy; {new Date().getFullYear()} Gerona Municipal Library. All rights reserved.
            </div>
        </div>
    );
}