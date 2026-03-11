import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Icon } from "@iconify/react";
import CheckoutForm from "./Partials/CheckoutForm";
import ActiveTransactionsTable from "./Partials/ActiveTransactionsTable";

export default function CirculationIndex({
    activeTransactions,
    patrons,
    availableCopies,
}: PageProps<{
    activeTransactions: any[];
    patrons: any[];
    availableCopies: any[];
}>) {
    return (
        <AdminLayout>
            <Head title="Circulation Desk" />

            <div className="max-w-full space-y-6">
                {/* COMPACT HEADER */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-rose-100 shadow-sm shadow-rose-100/50">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-rose-300 to-rose-500 w-12 h-12 rounded-xl flex items-center justify-center shadow-md shadow-rose-200 text-white">
                            <Icon icon="solar:round-transfer-horizontal-bold-duotone" className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">
                                Circulation Desk
                            </h1>
                            <p className="text-slate-500 text-xs font-medium mt-1">
                                Process checkouts, returns, and track active library assets.
                            </p>
                        </div>
                    </div>

                    <a
                        href={route("circulation.export")}
                        className="inline-flex items-center justify-center px-4 h-[38px] text-xs font-bold transition-all bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-lg border border-rose-200 shadow-sm group w-full sm:w-auto"
                    >
                        <Icon icon="solar:download-square-bold-duotone" className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform" />
                        Export Logs
                    </a>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* LEFT COLUMN: CHECKOUT FORM */}
                    <div className="lg:col-span-1">
                        <CheckoutForm patrons={patrons} availableCopies={availableCopies} />
                    </div>

                    {/* RIGHT COLUMN: ACTIVE TRANSACTIONS */}
                    <div className="lg:col-span-2">
                        <ActiveTransactionsTable transactions={activeTransactions} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}