// resources/js/Pages/Admin/PrintStation/Index.tsx
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Icon } from "@iconify/react";
import PrintQueueManager from "./Partials/PrintQueueManager";
import PrintHistoryTable from "./Partials/PrintHistoryTable";

export interface PrintJob {
    id: number; // Changed from filename to DB id
    time_uploaded: string;
    visitor_name: string;
    school_or_barangay: string;
    paper_size: string;
    copies: number;
    pages: string;
    original_name: string;
}

export default function PrintServices({
    printQueue = [],
    printLogs,
}: PageProps<{ printQueue: PrintJob[]; printLogs: any }>) {
    return (
        <AdminLayout>
            <Head title="Print Services" />

            <div className="max-w-full space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-pink-100 shadow-sm shadow-pink-100/50">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-pink-300 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-pink-300/50 text-white">
                            <Icon
                                icon="solar:printer-minimalistic-bold-duotone"
                                className="w-6 h-6"
                            />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">
                                Print Services
                            </h1>
                            <p className="text-slate-500 text-xs font-medium mt-1">
                                Manage incoming print requests and view
                                historical logs.
                            </p>
                        </div>
                    </div>

                    <a
                        href={route("print-services.export")}
                        className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold transition-all bg-pink-50 text-pink-600 hover:bg-pink-500 hover:text-white rounded-lg shadow-sm border border-pink-200"
                    >
                        <Icon
                            icon="solar:download-square-bold-duotone"
                            className="w-4 h-4 mr-2"
                        />
                        Export Logs
                    </a>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                    <div className="xl:col-span-2">
                        <PrintQueueManager queue={printQueue} />
                    </div>

                    <div className="xl:col-span-1">
                        <PrintHistoryTable logs={printLogs} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
