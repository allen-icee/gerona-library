import { Head, Link } from "@inertiajs/react";
import { PageProps } from "@/types";
import { BookOpen, Library } from "lucide-react";

export default function Welcome({
    auth,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    return (
        <div className="min-h-screen bg-slate-900 flex flex-col font-sans selection:bg-amber-600 selection:text-white">
            <Head title="Welcome - Gerona Municipal Library" />

            {/* Top Navigation Bar */}
            <header className="absolute top-0 w-full p-6 flex justify-between items-center z-20">
                <div className="flex items-center gap-3 text-stone-100">
                    <Library className="w-8 h-8 text-amber-500" />
                    <span className="text-xl font-serif font-bold tracking-tight">
                        Gerona Library
                    </span>
                </div>
                <nav>
                    {auth.user ? (
                        <Link
                            href={route("dashboard")}
                            className="text-sm font-semibold text-stone-300 hover:text-amber-500 transition-colors"
                        >
                            Go to Dashboard &rarr;
                        </Link>
                    ) : (
                        <Link
                            href={route("login")}
                            className="text-sm font-semibold text-stone-300 hover:text-amber-500 transition-colors"
                        >
                            Staff Login &rarr;
                        </Link>
                    )}
                </nav>
            </header>

            {/* Main Hero Section */}
            <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
                {/* Decorative Ambient Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-slate-700 via-transparent to-transparent"></div>
                </div>

                <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8 mt-12">
                    <div className="flex justify-center mb-8">
                        <div className="p-5 bg-slate-800/80 rounded-full border border-slate-700 shadow-xl backdrop-blur-sm">
                            <BookOpen className="w-14 h-14 text-amber-500" />
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-serif font-extrabold tracking-tight text-stone-100 drop-shadow-md">
                        Gerona Municipal Library
                    </h1>

                    <p className="text-xl md:text-2xl text-stone-400 font-serif italic max-w-2xl mx-auto leading-relaxed">
                        The official digital catalog and circulation management
                        system of the Municipality of Gerona.
                    </p>

                    <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
                        {auth.user ? (
                            <Link
                                href={route("dashboard")}
                                className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-amber-600/20 hover:-translate-y-0.5 w-full sm:w-auto"
                            >
                                Access System Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route("login")}
                                    className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-amber-600/20 hover:-translate-y-0.5 w-full sm:w-auto"
                                >
                                    System Login
                                </Link>
                                <button
                                    type="button"
                                    className="px-8 py-4 bg-slate-800 text-stone-400 rounded-lg font-bold text-lg border border-slate-700 w-full sm:w-auto opacity-70 cursor-not-allowed"
                                    title="Public Catalog Search Feature is in development."
                                >
                                    Public Catalog (Soon)
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </main>

            {/* Minimal Footer */}
            <footer className="w-full p-6 text-center text-sm text-slate-500 z-20 relative">
                &copy; {new Date().getFullYear()} Municipality of Gerona. All
                rights reserved.
            </footer>
        </div>
    );
}
