import { PropsWithChildren } from "react";
import { Link, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import {
    LayoutDashboard,
    BookOpen,
    Users,
    ArrowRightLeft,
    LogOut,
    Library,
    Printer,
    Gift,
    Settings,
    MonitorPlay,
} from "lucide-react";
import { Toaster } from "sonner"; // <-- Added sonner Toaster import

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";

export default function AdminLayout({ children }: PropsWithChildren) {
    const user = usePage<PageProps>().props.auth.user;
    const { url } = usePage();

    const isActive = (path: string) => url.startsWith(path);

    const navItems = [
        {
            name: "Dashboard",
            href: route("dashboard"),
            icon: LayoutDashboard,
            path: "/dashboard",
            active: "from-rose-400 to-rose-600 shadow-rose-400/50 border-rose-200",
            inactive: "bg-rose-100/70 text-rose-500 hover:border-rose-200 hover:text-rose-600",
        },
        {
            name: "Kiosk",
            href: route("admin.kiosk.index"),
            icon: MonitorPlay,
            path: "/admin/kiosk",
            active: "from-emerald-400 to-emerald-600 shadow-emerald-400/50 border-emerald-200",
            inactive: "bg-emerald-100/70 text-emerald-500 hover:border-emerald-200 hover:text-emerald-600",
        },
        {
            name: "Catalog",
            href: route("books.index"),
            icon: BookOpen,
            path: "/books",
            active: "from-pink-400 to-pink-600 shadow-pink-400/50 border-pink-200",
            inactive: "bg-pink-100/70 text-pink-500 hover:border-pink-200 hover:text-pink-600",
        },
        {
            name: "Patrons",
            href: route("patrons.index"),
            icon: Users,
            path: "/patrons",
            active: "from-fuchsia-400 to-fuchsia-600 shadow-fuchsia-400/50 border-fuchsia-200",
            inactive: "bg-fuchsia-100/70 text-fuchsia-500 hover:border-fuchsia-200 hover:text-fuchsia-600",
        },
        {
            name: "Circulation",
            href: route("circulation.index"),
            icon: ArrowRightLeft,
            path: "/circulation",
            active: "from-rose-300 to-rose-500 shadow-rose-300/50 border-rose-100",
            inactive: "bg-rose-50/90 text-rose-400 hover:border-rose-200 hover:text-rose-500",
        },
        {
            name: "Printing",
            href: route("print-services.index"),
            icon: Printer,
            path: "/print-services",
            active: "from-pink-300 to-pink-500 shadow-pink-300/50 border-pink-100",
            inactive: "bg-pink-50/90 text-pink-400 hover:border-pink-200 hover:text-pink-500",
        },
        {
            name: "Donations",
            href: route("donations.index"),
            icon: Gift,
            path: "/donations",
            active: "from-fuchsia-300 to-fuchsia-500 shadow-fuchsia-300/50 border-fuchsia-100",
            inactive: "bg-fuchsia-50/90 text-fuchsia-400 hover:border-fuchsia-200 hover:text-fuchsia-500",
        },
    ];

    // Split the tabs: 4 on the left, 3 on the right
    const leftNavItems = navItems.slice(0, 4);
    const rightNavItems = navItems.slice(4);

    return (
        <div className="min-h-screen bg-[#FFF0F5] font-sans text-stone-800 relative flex flex-col overflow-x-hidden">
            {/* Global Toaster Component Added Here */}
            <Toaster position="top-right" richColors closeButton />

            {/* Background Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-200/40 rounded-full blur-3xl pointer-events-none z-0"></div>
            <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[50%] bg-rose-200/30 rounded-full blur-3xl pointer-events-none z-0"></div>

            {/* THE BOOKMARK LOGO */}
            <Link
                href="/dashboard"
                className="absolute top-0 left-4 md:left-8 bg-rose-500 text-white px-3 md:px-4 py-3 md:py-4 rounded-b-[1.2rem] shadow-md shadow-pink-200 z-50 flex flex-col items-center group transition-all duration-300 hover:pt-6 hover:pb-5"
                title="Go to Dashboard"
            >
                <Library className="w-5 h-5 md:w-6 md:h-6 mb-1 group-hover:-rotate-12 transition-transform" />
                <span className="font-serif font-black text-[9px] md:text-[10px] uppercase tracking-widest leading-none">
                    Admin
                </span>
            </Link>

            {/* COMPACT PROFILE DROPDOWN */}
            <div className="absolute top-3 right-4 md:top-4 md:right-8 z-50">
                <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none outline-none flex items-center gap-2 group">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-slate-800 leading-none">
                                {user.name}
                            </p>
                            <p className="text-[9px] text-rose-500 font-bold uppercase tracking-widest mt-1">
                                {user.roles && user.roles.length > 0 ? user.roles[0] : "Librarian"}
                            </p>
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-white text-rose-500 flex items-center justify-center font-black shadow-sm border border-pink-100 group-hover:bg-rose-50 transition-all text-sm">
                            {user.name.charAt(0)}
                        </div>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-48 mt-2 bg-white rounded-xl border-2 border-pink-100 shadow-xl p-1.5 z-50">
                        <DropdownMenuLabel className="font-bold text-stone-700 text-xs">
                            My Account
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-pink-50" />
                        <DropdownMenuItem asChild className="rounded-lg hover:bg-pink-50 cursor-pointer text-stone-600 text-xs font-semibold mt-1">
                            <Link href={route("profile.edit")} className="w-full flex items-center">
                                <Settings className="w-3.5 h-3.5 mr-2" /> Settings
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-pink-50" />
                        <DropdownMenuItem asChild className="rounded-lg hover:bg-rose-50 cursor-pointer text-rose-600 text-xs font-bold mt-1">
                            <Link href={route("logout")} method="post" as="button" className="w-full flex items-center">
                                <LogOut className="w-3.5 h-3.5 mr-2" /> Log Out
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="max-w-[100rem] mx-auto w-full flex-1 flex flex-row pt-10 md:pt-14 px-2 md:px-6 relative z-10 pb-4 md:pb-6">

                {/* 1. LEFT TABS (First 4 items) */}
                <div className="flex flex-col space-y-1 md:space-y-1.5 pt-6 md:pt-8 items-end z-20 flex-shrink-0">
                    {leftNavItems.map((item, index) => {
                        const active = isActive(item.path);
                        const IconComponent = item.icon;

                        return active ? (
                            <Link
                                key={`left-${index}`}
                                href={item.href}
                                className={`flex flex-col items-center justify-center gap-1.5 bg-gradient-to-r text-white py-4 md:py-5 rounded-l-xl md:rounded-l-2xl shadow-lg border-2 border-r-0 relative z-20 translate-x-[2px] w-[2.5rem] md:w-[3.2rem] hover:w-[2.8rem] md:hover:w-[3.8rem] transition-all duration-300 ${item.active}`}
                            >
                                <IconComponent className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                                <span className="[writing-mode:vertical-rl] rotate-180 font-bold text-[9px] md:text-xs tracking-widest uppercase leading-none">
                                    {item.name}
                                </span>
                            </Link>
                        ) : (
                            <Link
                                key={`left-${index}`}
                                href={item.href}
                                className={`flex flex-col items-center justify-center gap-1.5 py-3 md:py-4 rounded-l-lg md:rounded-l-xl transition-all duration-300 border-2 border-transparent hover:border-r-0 relative z-10 translate-x-[2px] w-[2rem] md:w-[2.4rem] hover:w-[2.6rem] md:hover:w-[3.2rem] opacity-80 hover:opacity-100 hover:bg-white hover:shadow-[-4px_0px_10px_rgba(251,207,232,0.6)] ${item.inactive}`}
                            >
                                <IconComponent className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                                <span className="[writing-mode:vertical-rl] rotate-180 font-semibold text-[8px] md:text-[10px] tracking-widest uppercase leading-none">
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {/* 2. FOLDER BODY (Main Content) */}
                <main className="bg-white rounded-2xl md:rounded-3xl shadow-lg shadow-pink-200/30 border-2 border-pink-200 p-4 md:p-8 flex-1 relative z-10 flex flex-col min-w-0">
                    {children}
                </main>

                {/* 3. RIGHT TABS (Remaining 3 items) */}
                <div className="flex flex-col space-y-1 md:space-y-1.5 pt-6 md:pt-8 items-start z-20 flex-shrink-0">
                    {rightNavItems.map((item, index) => {
                        const active = isActive(item.path);
                        const IconComponent = item.icon;

                        return active ? (
                            <Link
                                key={`right-${index}`}
                                href={item.href}
                                className={`flex flex-col items-center justify-center gap-1.5 bg-gradient-to-r text-white py-4 md:py-5 rounded-r-xl md:rounded-r-2xl shadow-lg border-2 border-l-0 relative z-20 -translate-x-[2px] w-[2.5rem] md:w-[3.2rem] hover:w-[2.8rem] md:hover:w-[3.8rem] transition-all duration-300 ${item.active}`}
                            >
                                <IconComponent className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                                <span className="[writing-mode:vertical-rl] font-bold text-[9px] md:text-xs tracking-widest uppercase leading-none">
                                    {item.name}
                                </span>
                            </Link>
                        ) : (
                            <Link
                                key={`right-${index}`}
                                href={item.href}
                                className={`flex flex-col items-center justify-center gap-1.5 py-3 md:py-4 rounded-r-lg md:rounded-r-xl transition-all duration-300 border-2 border-transparent hover:border-l-0 relative z-10 -translate-x-[2px] w-[2rem] md:w-[2.4rem] hover:w-[2.6rem] md:hover:w-[3.2rem] opacity-80 hover:opacity-100 hover:bg-white hover:shadow-[4px_0px_10px_rgba(251,207,232,0.6)] ${item.inactive}`}
                            >
                                <IconComponent className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                                <span className="[writing-mode:vertical-rl] font-semibold text-[8px] md:text-[10px] tracking-widest uppercase leading-none">
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}