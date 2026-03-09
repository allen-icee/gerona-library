import { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import { PageProps } from "@/types";
import {
    BookCopy,
    Users,
    UserCheck,
    AlertTriangle,
    Clock,
    Calendar,
    UserPlus,
    BookOpen,
    Printer,
    MonitorPlay,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

interface DashboardMetrics {
    totalCopies: number;
    activePatrons: number;
    todaysVisitors: number;
    overdueBooks: number;
}

export default function Dashboard({
    auth,
    metrics,
}: PageProps<{ metrics: DashboardMetrics }>) {
    // Live Clock State
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <AdminLayout>
            <Head title="Dashboard" />

            <div className="max-w-full space-y-8">
                {/* Header & Live Clock Area */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-stone-800">
                            Welcome back, {auth.user.name} 👋
                        </h1>
                        <p className="text-stone-500 text-sm mt-1">
                            Here is what is happening at the Gerona Municipal
                            Library today.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-inner">
                        <div className="flex items-center gap-2 border-r border-slate-700 pr-4">
                            <Calendar className="w-5 h-5 text-amber-500" />
                            <span className="font-medium text-sm">
                                {currentTime.toLocaleDateString("en-PH", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 pl-1">
                            <Clock className="w-5 h-5 text-emerald-400" />
                            <span className="font-bold font-mono text-lg tracking-wider">
                                {currentTime.toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Bar */}
                <div>
                    <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-4">
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link
                            href={route("kiosk.dashboard")}
                            className="flex flex-col items-center justify-center p-5 bg-white border border-stone-200 rounded-2xl hover:border-emerald-500 hover:shadow-md transition-all group"
                        >
                            <div className="bg-emerald-50 p-3 rounded-full group-hover:bg-emerald-500 group-hover:text-white transition-colors mb-3 text-emerald-600">
                                <MonitorPlay className="w-7 h-7" />
                            </div>
                            <span className="font-bold text-stone-700 group-hover:text-emerald-700">
                                View Active Kiosk
                            </span>
                        </Link>

                        <Link
                            href={route("patrons.index")}
                            className="flex flex-col items-center justify-center p-5 bg-white border border-stone-200 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all group"
                        >
                            <div className="bg-blue-50 p-3 rounded-full group-hover:bg-blue-500 group-hover:text-white transition-colors mb-3 text-blue-600">
                                <UserPlus className="w-7 h-7" />
                            </div>
                            <span className="font-bold text-stone-700 group-hover:text-blue-700">
                                Patron Registry
                            </span>
                        </Link>

                        <Link
                            href={route("circulation.index")}
                            className="flex flex-col items-center justify-center p-5 bg-white border border-stone-200 rounded-2xl hover:border-amber-500 hover:shadow-md transition-all group"
                        >
                            <div className="bg-amber-50 p-3 rounded-full group-hover:bg-amber-500 group-hover:text-white transition-colors mb-3 text-amber-600">
                                <BookOpen className="w-7 h-7" />
                            </div>
                            <span className="font-bold text-stone-700 group-hover:text-amber-700">
                                Book Circulation
                            </span>
                        </Link>

                        <Link
                            href={route("print-services.index")}
                            className="flex flex-col items-center justify-center p-5 bg-white border border-stone-200 rounded-2xl hover:border-rose-500 hover:shadow-md transition-all group"
                        >
                            <div className="bg-rose-50 p-3 rounded-full group-hover:bg-rose-500 group-hover:text-white transition-colors mb-3 text-rose-600">
                                <Printer className="w-7 h-7" />
                            </div>
                            <span className="font-bold text-stone-700 group-hover:text-rose-700">
                                Print Station Queue
                            </span>
                        </Link>
                    </div>
                </div>

                {/* Dashboard Metric Cards */}
                <div>
                    <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-4">
                        Live Statistics
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-bold text-stone-600">
                                    Today's Visitors
                                </CardTitle>
                                <UserCheck className="w-5 h-5 text-emerald-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-black text-slate-800">
                                    {metrics?.todaysVisitors || 0}
                                </div>
                                <p className="text-xs text-stone-400 mt-2 font-medium">
                                    Walk-ins logged via Kiosk
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-bold text-stone-600">
                                    Active Patrons
                                </CardTitle>
                                <Users className="w-5 h-5 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-black text-slate-800">
                                    {metrics?.activePatrons || 0}
                                </div>
                                <p className="text-xs text-stone-400 mt-2 font-medium">
                                    Registered library card holders
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-bold text-stone-600">
                                    Physical Inventory
                                </CardTitle>
                                <BookCopy className="w-5 h-5 text-amber-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-black text-slate-800">
                                    {metrics?.totalCopies || 0}
                                </div>
                                <p className="text-xs text-stone-400 mt-2 font-medium">
                                    Total physical copies registered
                                </p>
                            </CardContent>
                        </Card>

                        <Card
                            className={`shadow-sm hover:shadow-md transition-shadow ${metrics?.overdueBooks > 0 ? "border-red-300 bg-red-50/50" : "border-stone-200"}`}
                        >
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle
                                    className={`text-sm font-bold ${metrics?.overdueBooks > 0 ? "text-red-700" : "text-stone-600"}`}
                                >
                                    Overdue Books
                                </CardTitle>
                                <AlertTriangle
                                    className={`w-5 h-5 ${metrics?.overdueBooks > 0 ? "text-red-600" : "text-stone-400"}`}
                                />
                            </CardHeader>
                            <CardContent>
                                <div
                                    className={`text-4xl font-black ${metrics?.overdueBooks > 0 ? "text-red-700" : "text-slate-800"}`}
                                >
                                    {metrics?.overdueBooks || 0}
                                </div>
                                <p
                                    className={`text-xs mt-2 font-medium ${metrics?.overdueBooks > 0 ? "text-red-500" : "text-stone-400"}`}
                                >
                                    Books past their return date
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
