import { PropsWithChildren } from "react";
import { Link, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import {
    LayoutDashboard,
    BookOpen,
    Users,
    ArrowRightLeft,
    Settings,
    LogOut,
    Library,
} from "lucide-react";

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

    // Helper to check if a link is active based on the current URL
    const { url } = usePage();
    const isActive = (path: string) => url.startsWith(path);

    return (
        <div className="min-h-screen bg-stone-100 flex">
            {/* ================= SIDEBAR ================= */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed inset-y-0 z-10">
                {/* Logo Area */}
                <div className="h-16 flex items-center px-6 bg-slate-950 text-white font-serif tracking-tight">
                    <Library className="w-6 h-6 mr-3 text-amber-500" />
                    <span className="text-lg font-bold">Gerona Library</span>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    <Link
                        href={route("dashboard")}
                        className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive("/dashboard") ? "bg-amber-600 text-white shadow-md" : "hover:bg-slate-800 hover:text-white"}`}
                    >
                        <LayoutDashboard className="w-5 h-5 mr-3" />
                        Dashboard
                    </Link>

                    {/* We will build these routes next! */}
                    <div className="pt-4 pb-2">
                        <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Management
                        </p>
                    </div>

                    <Link
                        href={route("books.index")}
                        className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive("/books") ? "bg-amber-600 text-white shadow-md" : "hover:bg-slate-800 hover:text-white"}`}
                    >
                        <BookOpen className="w-5 h-5 mr-3" />
                        Master Catalog
                    </Link>

                    <Link
                        href="#"
                        className="flex items-center px-4 py-3 rounded-lg transition-colors hover:bg-slate-800 hover:text-white"
                    >
                        <Users className="w-5 h-5 mr-3" />
                        Patron Registry
                    </Link>

                    <Link
                        href="#"
                        className="flex items-center px-4 py-3 rounded-lg transition-colors hover:bg-slate-800 hover:text-white"
                    >
                        <ArrowRightLeft className="w-5 h-5 mr-3" />
                        Circulation
                    </Link>
                </nav>

                {/* Bottom Settings Link */}
                <div className="p-4 bg-slate-950">
                    <Link
                        href={route("profile.edit")}
                        className="flex items-center px-4 py-2 text-sm rounded-lg transition-colors hover:bg-slate-800 hover:text-white"
                    >
                        <Settings className="w-4 h-4 mr-3" />
                        System Settings
                    </Link>
                </div>
            </aside>

            {/* ================= MAIN CONTENT AREA ================= */}
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-8 z-0 sticky top-0">
                    <h2 className="text-xl font-semibold text-stone-800">
                        {/* We can pass dynamic titles here later, but for now we keep it clean */}
                        Library Operations
                    </h2>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-stone-900">
                                {user.name}
                            </p>
                            <p className="text-xs text-amber-600 font-medium">
                                {user.roles[0]}
                            </p>
                        </div>

                        {/* Shadcn Dropdown Menu for Logout */}
                        <DropdownMenu>
                            <DropdownMenuTrigger className="focus:outline-none">
                                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold shadow-sm hover:bg-slate-800 transition-colors">
                                    {user.name.charAt(0)}
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-56 mt-1"
                            >
                                <DropdownMenuLabel>
                                    My Account
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={route("profile.edit")}
                                        className="w-full cursor-pointer"
                                    >
                                        Profile Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="w-full cursor-pointer text-red-600 focus:text-red-700"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Log Out
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content goes here */}
                <main className="p-8 flex-1">{children}</main>
            </div>
        </div>
    );
}
