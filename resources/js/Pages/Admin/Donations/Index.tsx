// resources/js/Pages/Admin/Donations/Index.tsx

import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Icon } from "@iconify/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import AddDonationModal from "./Partials/AddDonationModal";
import DonationsTable from "./Partials/DonationsTable";

export default function DonationsIndex({
    donations,
    totals,
}: PageProps<{ donations: any; totals: any }>) {

    // Helper to format PHP currency
    const formatPHP = (amount: number) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
        }).format(amount || 0);
    };

    return (
        <AdminLayout>
            <Head title="Donations Tracker" />

            <div className="max-w-full space-y-6">
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-fuchsia-100 shadow-sm shadow-fuchsia-100/50">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-fuchsia-300 to-fuchsia-500 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-fuchsia-300/50 text-white">
                            <Icon icon="solar:gift-bold-duotone" className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">
                                Donations Tracker
                            </h1>
                            <p className="text-slate-500 text-xs font-medium mt-1">
                                Log and audit grants, books, and equipment gifted to the library.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href={route("donations.export")}
                            className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold transition-all bg-fuchsia-50 text-fuchsia-600 hover:bg-fuchsia-500 hover:text-white rounded-lg shadow-sm border border-fuchsia-200 group"
                        >
                            <Icon icon="solar:download-square-bold-duotone" className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform" />
                            Export
                        </a>

                        {/* ADD MODAL */}
                        <AddDonationModal />
                    </div>
                </div>

                {/* METRIC CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="shadow-sm border-fuchsia-100 bg-gradient-to-br from-white to-fuchsia-50/30">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-stone-500">
                                Total Est. Value
                            </CardTitle>
                            <Icon icon="solar:wallet-money-bold-duotone" className="w-6 h-6 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-slate-800 tracking-tight">
                                {formatPHP(totals.total_value)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-fuchsia-100 bg-gradient-to-br from-white to-fuchsia-50/30">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-stone-500">
                                Total Logged
                            </CardTitle>
                            <Icon icon="solar:box-minimalistic-bold-duotone" className="w-6 h-6 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-slate-800 tracking-tight">
                                {totals.total_donations}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-fuchsia-100 bg-gradient-to-br from-white to-fuchsia-50/30">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-stone-500">
                                Book Donors
                            </CardTitle>
                            <Icon icon="solar:book-bookmark-bold-duotone" className="w-6 h-6 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-slate-800 tracking-tight">
                                {totals.book_donations}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-fuchsia-100 bg-gradient-to-br from-white to-fuchsia-50/30">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-stone-500">
                                Equipment Grants
                            </CardTitle>
                            <Icon icon="solar:monitor-bold-duotone" className="w-6 h-6 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-slate-800 tracking-tight">
                                {totals.equipment_donations}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* TABLE PORTION */}
                <DonationsTable donations={donations} />
            </div>
        </AdminLayout>
    );
}