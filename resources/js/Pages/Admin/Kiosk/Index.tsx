// resources/js/Pages/Admin/Kiosk/Index.tsx

import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Icon } from "@iconify/react";
import KioskTable from "./Partials/KioskTable";

export default function AdminKiosk({
    visitorLogs,
    isHistoryMode,
}: PageProps<{ visitorLogs: any; isHistoryMode: boolean }>) {

    const toggleMode = () => {
        router.get(
            route("admin.kiosk.index"),
            { history: !isHistoryMode },
            { preserveState: true }
        );
    };

    return (
        <AdminLayout>
            <Head title="Kiosk Control Panel" />

            <div className="max-w-full space-y-6">
                {/* COMPACT HEADER */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm shadow-emerald-100/50">

                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-md shadow-emerald-300/50 text-white shrink-0">
                            <Icon icon="lucide:monitor-play" className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">
                                Kiosk Control Panel
                            </h1>
                            <p className="text-slate-500 text-xs font-medium mt-1">
                                Manage active library visitors and view Kiosk history.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
                        {/* Toggle Mode Button */}
                        <button
                            onClick={toggleMode}
                            className="inline-flex items-center justify-center px-4 h-10 text-xs font-bold transition-all bg-white text-emerald-600 hover:bg-emerald-50 rounded-xl border border-emerald-200 shadow-sm flex-1 sm:flex-none"
                        >
                            {isHistoryMode ? (
                                <><Icon icon="solar:users-group-two-rounded-bold-duotone" className="w-4 h-4 mr-2 text-emerald-500" /> View Active</>
                            ) : (
                                <><Icon icon="solar:history-bold-duotone" className="w-4 h-4 mr-2 text-stone-500" /> View History</>
                            )}
                        </button>

                        {/* Export Button */}
                        <a
                            href={route("admin.kiosk.export")}
                            className="inline-flex items-center justify-center px-4 h-10 text-xs font-bold transition-all bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white rounded-xl border border-emerald-200 shadow-sm group flex-1 sm:flex-none"
                        >
                            <Icon icon="solar:download-square-bold-duotone" className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform" />
                            Export CSV
                        </a>

                        {/* Open Public Kiosk */}
                        <Link
                            href={route("kiosk.dashboard")}
                            className="inline-flex items-center justify-center px-4 h-10 text-xs font-bold transition-all bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white rounded-xl shadow-md shadow-emerald-200 border-none flex-1 sm:flex-none w-full sm:w-auto mt-2 sm:mt-0"
                        >
                            <Icon icon="solar:screen-share-bold-duotone" className="w-4 h-4 mr-2" />
                            Open Public Kiosk
                        </Link>
                    </div>
                </div>

                {/* TABLE COMPONENT */}
                <KioskTable visitorLogs={visitorLogs} isHistoryMode={isHistoryMode} />
            </div>
        </AdminLayout>
    );
}