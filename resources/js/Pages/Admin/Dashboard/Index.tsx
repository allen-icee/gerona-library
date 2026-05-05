//resources\js\Pages\Admin\Dashboard\Index.tsx
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";

import DashboardHeader from "./Partials/DashboardHeader";
import QuickActions from "./Partials/QuickActions";
import MetricCards from "./Partials/MetricCards";
import DashboardCharts from "./Partials/DashboardCharts";

export interface DashboardMetrics {
    totalCopies: number;
    activePatrons: number;
    todaysVisitors: number;
    overdueBooks: number;
}

export default function Dashboard({
    auth,
    metrics,
    charts,
}: PageProps<{ metrics: DashboardMetrics; charts: any }>) {
    return (
        <AdminLayout>
            <Head title="Dashboard" />

            <div className="max-w-full space-y-8">
                <DashboardHeader user={auth.user} />
                <QuickActions />
                <MetricCards metrics={metrics} />
                <DashboardCharts charts={charts} />
            </div>
        </AdminLayout>
    );
}
