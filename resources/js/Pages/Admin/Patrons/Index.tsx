// resources/js/Pages/Admin/Patrons/Index.tsx

import { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Input } from "@/Components/ui/input";
import { Icon } from "@iconify/react";

import AddPatronModal from "./Partials/AddPatronModal";
import PatronsTable from "./Partials/PatronTables";
import LibraryCard from "@/Components/LibraryCard";

export default function PatronIndex({
    patrons,
    filters,
}: PageProps<{ patrons: any; filters: { search?: string } }>) {
    const [search, setSearch] = useState(filters.search || "");
    const [patronToPrint, setPatronToPrint] = useState<any>(null);

    useEffect(() => {
        const delayBounceFn = setTimeout(() => {
            if (search !== filters.search) {
                router.get(
                    route("patrons.index"),
                    { search },
                    { preserveState: true, replace: true },
                );
            }
        }, 500);
        return () => clearTimeout(delayBounceFn);
    }, [search]);

    // Triggers browser print dialog when patronToPrint is set
    useEffect(() => {
        if (patronToPrint) {
            const printTimeout = setTimeout(() => {
                window.print();
                setPatronToPrint(null);
            }, 100);
            return () => clearTimeout(printTimeout);
        }
    }, [patronToPrint]);

    return (
        <AdminLayout>
            <Head title="Patron Registry" />

            <div className="max-w-full space-y-6">
                {/* COMPACT HEADER */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-2xl border border-fuchsia-100 shadow-sm shadow-fuchsia-100/50">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-fuchsia-400 to-fuchsia-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-md shadow-fuchsia-200 text-white">
                            <Icon icon="solar:users-group-two-rounded-bold-duotone" className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">
                                Patron Registry
                            </h1>
                            <p className="text-slate-500 text-xs font-medium mt-1">
                                Manage library borrowers and their access status.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row w-full lg:w-auto items-center gap-3">
                        {/* Search Bar */}
                        <div className="relative w-full sm:w-72">
                            <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                            <Input
                                placeholder="Search name or card..."
                                className="pl-9 h-10 bg-stone-50 border-stone-200 focus-visible:ring-fuchsia-500 rounded-xl text-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Export Button */}
                        <a
                            href={route("patrons.export")}
                            className="inline-flex items-center justify-center h-10 px-4 w-full sm:w-auto text-xs font-bold transition-all bg-fuchsia-50 text-fuchsia-600 hover:bg-fuchsia-500 hover:text-white rounded-xl border border-fuchsia-200 shadow-sm group whitespace-nowrap"
                        >
                            <Icon icon="solar:download-square-bold-duotone" className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform" />
                            Export CSV
                        </a>

                        {/* Add Patron Modal Trigger */}
                        <AddPatronModal />
                    </div>
                </div>

                {/* DATA TABLE */}
                <PatronsTable patrons={patrons} onPrint={setPatronToPrint} />
            </div>

            {/* HIDDEN PRINT COMPONENT */}
            {patronToPrint && (
                <div className="hidden print:block absolute top-0 left-0 bg-white">
                    <LibraryCard patron={patronToPrint} />
                </div>
            )}
        </AdminLayout>
    );
}