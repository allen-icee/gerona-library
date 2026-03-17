// resources/js/Pages/Admin/Dashboard/Partials/MetricCards.tsx

import { Icon } from "@iconify/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { DashboardMetrics } from "../Index";

export default function MetricCards({ metrics }: { metrics: DashboardMetrics }) {
    return (
        <div>
            <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4 ml-1">
                Live Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                <Card className="shadow-sm border-rose-100 bg-lienar-to-br from-white to-rose-50/30 rounded-2xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-stone-500">
                            Today's Visitors
                        </CardTitle>
                        <Icon icon="solar:user-check-bold-duotone" className="w-6 h-6 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-800 tracking-tight">
                            {metrics?.todaysVisitors || 0}
                        </div>
                        <p className="text-[10px] text-stone-400 mt-1 font-bold uppercase tracking-wider">
                            Walk-ins logged
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-rose-100 bg-linear-to-br from-white to-rose-50/30 rounded-2xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-stone-500">
                            Active Patrons
                        </CardTitle>
                        <Icon icon="solar:users-group-rounded-bold-duotone" className="w-6 h-6 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-800 tracking-tight">
                            {metrics?.activePatrons || 0}
                        </div>
                        <p className="text-[10px] text-stone-400 mt-1 font-bold uppercase tracking-wider">
                            Card holders
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-rose-100 bg-linear-to-br from-white to-rose-50/30 rounded-2xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-stone-500">
                            Physical Inventory
                        </CardTitle>
                        <Icon icon="solar:book-bold-duotone" className="w-6 h-6 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-800 tracking-tight">
                            {metrics?.totalCopies || 0}
                        </div>
                        <p className="text-[10px] text-stone-400 mt-1 font-bold uppercase tracking-wider">
                            Total registered copies
                        </p>
                    </CardContent>
                </Card>

                {/* Overdue Books - Turns Red if > 0 */}
                <Card
                    className={`shadow-sm rounded-2xl transition-all ${metrics?.overdueBooks > 0
                        ? "border-red-200 bg-linear-to-br from-red-50 to-red-100/50 shadow-red-100"
                        : "border-rose-100 bg-linear-to-br from-white to-rose-50/30"
                        }`}
                >
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle
                            className={`text-xs font-bold uppercase tracking-wider ${metrics?.overdueBooks > 0 ? "text-red-700" : "text-stone-500"
                                }`}
                        >
                            Overdue Books
                        </CardTitle>
                        <Icon
                            icon="solar:danger-triangle-bold-duotone"
                            className={`w-6 h-6 ${metrics?.overdueBooks > 0 ? "text-red-600 animate-pulse" : "text-stone-400"}`}
                        />
                    </CardHeader>
                    <CardContent>
                        <div
                            className={`text-3xl font-black tracking-tight ${metrics?.overdueBooks > 0 ? "text-red-700" : "text-slate-800"
                                }`}
                        >
                            {metrics?.overdueBooks || 0}
                        </div>
                        <p
                            className={`text-[10px] mt-1 font-bold uppercase tracking-wider ${metrics?.overdueBooks > 0 ? "text-red-500" : "text-stone-400"
                                }`}
                        >
                            Past return date
                        </p>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}