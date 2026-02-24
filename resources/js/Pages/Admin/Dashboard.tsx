import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import { BookCopy, Users, UserCheck, AlertTriangle } from "lucide-react";
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
    return (
        <AdminLayout>
            <Head title="Dashboard" />

            <div className="max-w-7xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-stone-800">
                        Welcome back, {auth.user.name}
                    </h1>
                    <p className="text-stone-500 text-sm">
                        Here is what is happening at the Gerona Municipal
                        Library today.
                    </p>
                </div>

                {/* Dashboard Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="border-stone-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-stone-500">
                                Today's Visitors
                            </CardTitle>
                            <UserCheck className="w-5 h-5 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-stone-800">
                                {metrics.todaysVisitors}
                            </div>
                            <p className="text-xs text-stone-400 mt-1">
                                Walk-ins logged via Kiosk
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-stone-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-stone-500">
                                Active Patrons
                            </CardTitle>
                            <Users className="w-5 h-5 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-stone-800">
                                {metrics.activePatrons}
                            </div>
                            <p className="text-xs text-stone-400 mt-1">
                                Registered library card holders
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-stone-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-stone-500">
                                Physical Inventory
                            </CardTitle>
                            <BookCopy className="w-5 h-5 text-amber-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-stone-800">
                                {metrics.totalCopies}
                            </div>
                            <p className="text-xs text-stone-400 mt-1">
                                Total physical copies registered
                            </p>
                        </CardContent>
                    </Card>

                    <Card
                        className={`shadow-sm ${metrics.overdueBooks > 0 ? "border-red-200 bg-red-50/30" : "border-stone-200"}`}
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle
                                className={`text-sm font-medium ${metrics.overdueBooks > 0 ? "text-red-600" : "text-stone-500"}`}
                            >
                                Overdue Books
                            </CardTitle>
                            <AlertTriangle
                                className={`w-5 h-5 ${metrics.overdueBooks > 0 ? "text-red-600" : "text-stone-400"}`}
                            />
                        </CardHeader>
                        <CardContent>
                            <div
                                className={`text-3xl font-bold ${metrics.overdueBooks > 0 ? "text-red-700" : "text-stone-800"}`}
                            >
                                {metrics.overdueBooks}
                            </div>
                            <p
                                className={`text-xs mt-1 ${metrics.overdueBooks > 0 ? "text-red-500 font-medium" : "text-stone-400"}`}
                            >
                                Books past their return date
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
