import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, Link } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Users, History, LogOut, Clock, FileDown } from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/Components/ui/card";

export default function AdminKiosk({
    visitorLogs,
    isHistoryMode,
}: PageProps<{ visitorLogs: any; isHistoryMode: boolean }>) {
    const [processingId, setProcessingId] = useState<number | null>(null);

    const handleForceCheckout = (id: number) => {
        if (confirm("Are you sure you want to log this user out?")) {
            setProcessingId(id);
            router.patch(
                route("visitor-logs.checkout", id),
                {},
                {
                    preserveScroll: true,
                    onFinish: () => setProcessingId(null),
                },
            );
        }
    };

    const toggleMode = () => {
        router.get(
            route("admin.kiosk.index"),
            { history: !isHistoryMode },
            { preserveState: true },
        );
    };

    return (
        <AdminLayout>
            <Head title="Kiosk Control Panel" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-stone-800">
                            Kiosk Control Panel
                        </h1>
                        <p className="text-stone-500 text-sm">
                            Manage active library visitors and view Kiosk
                            history.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <a
                            href={route("admin.kiosk.export")}
                            className="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium transition-colors bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-md shadow-sm whitespace-nowrap"
                        >
                            <FileDown className="w-4 h-4 mr-2" />
                            Export CSV
                        </a>
                        <Button
                            variant="outline"
                            onClick={toggleMode}
                            className="bg-white border-stone-200 text-stone-700 font-bold shadow-sm"
                        >
                            {isHistoryMode ? (
                                <>
                                    <Users className="w-4 h-4 mr-2 text-emerald-600" />{" "}
                                    View Active Only
                                </>
                            ) : (
                                <>
                                    <History className="w-4 h-4 mr-2 text-blue-600" />{" "}
                                    View Full History
                                </>
                            )}
                        </Button>
                        <Link href={route("kiosk.dashboard")}>
                            <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm">
                                Open Public Kiosk View
                            </Button>
                        </Link>
                    </div>
                </div>

                <Card className="shadow-sm border-stone-200">
                    <CardHeader
                        className={`${isHistoryMode ? "bg-slate-100" : "bg-emerald-50"} border-b border-stone-200 rounded-t-lg`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg flex items-center text-stone-800">
                                    {isHistoryMode ? (
                                        <History className="w-5 h-5 mr-2 text-stone-500" />
                                    ) : (
                                        <Users className="w-5 h-5 mr-2 text-emerald-600" />
                                    )}
                                    {isHistoryMode
                                        ? "Historical Visitor Logs"
                                        : "Currently Active Visitors"}
                                </CardTitle>
                                <CardDescription className="text-stone-600 font-medium mt-1">
                                    {isHistoryMode
                                        ? "A complete record of everyone who has visited."
                                        : "People who have signed in but haven't signed out yet."}
                                </CardDescription>
                            </div>
                            {!isHistoryMode && (
                                <div className="bg-white text-emerald-700 px-4 py-1.5 rounded-full text-sm font-bold flex items-center shadow-sm border border-emerald-200">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2"></span>
                                    {visitorLogs.total} Active Now
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-stone-50">
                                <TableRow>
                                    <TableHead className="font-semibold text-stone-700 w-[250px]">
                                        Visitor Details
                                    </TableHead>
                                    <TableHead className="font-semibold text-stone-700">
                                        Purpose
                                    </TableHead>
                                    <TableHead className="font-semibold text-stone-700">
                                        Time In
                                    </TableHead>
                                    <TableHead className="font-semibold text-stone-700">
                                        Time Out
                                    </TableHead>
                                    <TableHead className="font-semibold text-stone-700 text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {visitorLogs.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="h-40 text-center text-stone-500"
                                        >
                                            <Users className="w-12 h-12 mx-auto text-stone-300 mb-3" />
                                            {isHistoryMode
                                                ? "No historical records found."
                                                : "No one is currently logged into the library."}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    visitorLogs.data.map((log: any) => (
                                        <TableRow
                                            key={log.id}
                                            className="hover:bg-stone-50 transition-colors"
                                        >
                                            <TableCell>
                                                <p className="font-bold text-slate-800">
                                                    {log.visitor_name}
                                                </p>
                                                <p className="text-xs text-stone-500 flex flex-col mt-0.5">
                                                    <span>{log.address}</span>
                                                    {log.school && (
                                                        <span className="font-medium text-amber-600">
                                                            {log.school}
                                                        </span>
                                                    )}
                                                </p>
                                            </TableCell>
                                            <TableCell className="text-stone-600 text-sm font-medium">
                                                {log.purpose}
                                            </TableCell>
                                            <TableCell className="text-stone-600">
                                                <div className="flex items-center text-sm">
                                                    <Clock className="w-4 h-4 mr-1.5 text-stone-400" />
                                                    {new Date(
                                                        log.time_in,
                                                    ).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </div>
                                                <div className="text-[10px] text-stone-400 mt-1 uppercase tracking-wider">
                                                    {new Date(
                                                        log.time_in,
                                                    ).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-stone-600">
                                                {log.time_out ? (
                                                    <div className="flex items-center text-sm font-medium text-stone-800">
                                                        <Clock className="w-4 h-4 mr-1.5 text-stone-400" />
                                                        {new Date(
                                                            log.time_out,
                                                        ).toLocaleTimeString(
                                                            [],
                                                            {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            },
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                                                        Inside
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {!log.time_out && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            handleForceCheckout(
                                                                log.id,
                                                            )
                                                        }
                                                        disabled={
                                                            processingId ===
                                                            log.id
                                                        }
                                                        className="bg-rose-500 hover:bg-rose-600 text-white shadow-sm font-bold"
                                                    >
                                                        {processingId ===
                                                        log.id ? (
                                                            "Processing..."
                                                        ) : (
                                                            <>
                                                                <LogOut className="w-4 h-4 mr-2" />{" "}
                                                                Force Time Out
                                                            </>
                                                        )}
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pagination Controls */}
                {visitorLogs.total > 15 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-stone-500">
                            Showing{" "}
                            <span className="font-medium">
                                {visitorLogs.from}
                            </span>{" "}
                            to{" "}
                            <span className="font-medium">
                                {visitorLogs.to}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium">
                                {visitorLogs.total}
                            </span>{" "}
                            records
                        </p>
                        <div className="flex gap-1">
                            {visitorLogs.links.map(
                                (link: any, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            link.url &&
                                            router.get(
                                                link.url,
                                                { history: isHistoryMode },
                                                { preserveState: true },
                                            )
                                        }
                                        disabled={!link.url || link.active}
                                        className={`px-3 py-1 text-sm border rounded-md transition-colors ${link.active ? "bg-slate-900 text-white border-slate-900" : !link.url ? "bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed" : "bg-white text-stone-700 border-stone-300 hover:bg-stone-50"}`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ),
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
