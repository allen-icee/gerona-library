// resources/js/Pages/Admin/Kiosk/Partials/KioskTable.tsx

import { useState } from "react";
import { router, Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/Components/ui/dialog";

export default function KioskTable({
    visitorLogs,
    isHistoryMode,
}: {
    visitorLogs: any;
    isHistoryMode: boolean;
}) {
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [visitorToLogout, setVisitorToLogout] = useState<number | null>(null);
    const [processingId, setProcessingId] = useState<number | null>(null);

    const confirmLogout = () => {
        if (visitorToLogout !== null) {
            setProcessingId(visitorToLogout);
            router.patch(
                route("visitor-logs.checkout", visitorToLogout),
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setIsLogoutModalOpen(false);
                        setVisitorToLogout(null);
                    },
                    onFinish: () => setProcessingId(null),
                },
            );
        }
    };

    return (
        <>
            <div className="bg-white border border-emerald-100 rounded-xl shadow-sm shadow-emerald-100/50 overflow-hidden flex flex-col">
                <div className="bg-emerald-50/50 border-b border-emerald-100 px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Icon
                            icon={
                                isHistoryMode
                                    ? "solar:history-bold-duotone"
                                    : "solar:users-group-rounded-bold-duotone"
                            }
                            className="w-5 h-5 text-emerald-500"
                        />
                        <div>
                            <h2 className="text-sm font-bold text-slate-800 leading-tight">
                                {isHistoryMode
                                    ? "Historical Visitor Logs"
                                    : "Currently Active Visitors"}
                            </h2>
                            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                {isHistoryMode
                                    ? "A complete record of everyone who has visited."
                                    : "People who have signed in but haven't signed out yet."}
                            </p>
                        </div>
                    </div>
                    {!isHistoryMode && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-200 flex items-center">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5"></span>
                            {visitorLogs.total} Active
                        </span>
                    )}
                </div>

                <div className="flex-1 overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-white hover:bg-white border-b border-emerald-50">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="text-[10px] uppercase text-stone-400 font-bold tracking-wider pl-6 w-62.5">
                                    Visitor Details
                                </TableHead>
                                <TableHead className="text-[10px] uppercase text-stone-400 font-bold tracking-wider">
                                    Purpose
                                </TableHead>
                                <TableHead className="text-[10px] uppercase text-stone-400 font-bold tracking-wider">
                                    Time In
                                </TableHead>
                                <TableHead className="text-[10px] uppercase text-stone-400 font-bold tracking-wider">
                                    Time Out
                                </TableHead>
                                <TableHead className="text-[10px] uppercase text-stone-400 font-bold tracking-wider text-right pr-6">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {visitorLogs.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="h-40 text-center text-xs text-stone-400 font-medium"
                                    >
                                        <Icon
                                            icon="solar:ghost-smile-bold-duotone"
                                            className="w-10 h-10 text-emerald-200 mx-auto mb-2"
                                        />
                                        {isHistoryMode
                                            ? "No historical records found."
                                            : "No one is currently logged into the library."}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                visitorLogs.data.map((log: any) => (
                                    <TableRow
                                        key={log.id}
                                        className="hover:bg-emerald-50/30 transition-colors border-emerald-50"
                                    >
                                        <TableCell className="pl-6 py-3">
                                            <p className="font-bold text-slate-800 text-sm">
                                                {log.visitor_name}
                                            </p>
                                            <div className="text-[10px] text-stone-500 font-medium mt-1 space-y-0.5">
                                                <p className="flex items-center gap-1.5">
                                                    <Icon
                                                        icon="solar:map-point-bold-duotone"
                                                        className="w-3 h-3 text-emerald-400"
                                                    />{" "}
                                                    {log.address}
                                                </p>
                                                {log.school && (
                                                    <p className="flex items-center gap-1.5 text-emerald-600">
                                                        <Icon
                                                            icon="solar:buildings-bold-duotone"
                                                            className="w-3 h-3 text-emerald-500"
                                                        />{" "}
                                                        {log.school}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3 text-stone-600 text-sm font-medium">
                                            {log.purpose}
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <div className="flex items-center text-sm font-bold text-slate-700">
                                                <Icon
                                                    icon="solar:clock-circle-bold-duotone"
                                                    className="w-4 h-4 mr-1.5 text-emerald-500"
                                                />
                                                {new Date(
                                                    log.time_in,
                                                ).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </div>
                                            <div className="text-[10px] text-stone-400 font-medium mt-1 tracking-wide">
                                                {new Date(
                                                    log.time_in,
                                                ).toLocaleDateString([], {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3">
                                            {log.time_out ? (
                                                <div>
                                                    <div className="flex items-center text-sm font-bold text-slate-700">
                                                        <Icon
                                                            icon="solar:stopwatch-bold-duotone"
                                                            className="w-4 h-4 mr-1.5 text-stone-400"
                                                        />
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
                                                    <div className="text-[10px] text-stone-400 font-medium mt-1 tracking-wide">
                                                        {new Date(
                                                            log.time_out,
                                                        ).toLocaleDateString(
                                                            [],
                                                            {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            },
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                    Inside
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right pr-6 py-3">
                                            {!log.time_out && (
                                                <button
                                                    onClick={() => {
                                                        setVisitorToLogout(
                                                            log.id,
                                                        );
                                                        setIsLogoutModalOpen(
                                                            true,
                                                        );
                                                    }}
                                                    disabled={
                                                        processingId === log.id
                                                    }
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-500 hover:text-white border border-rose-100 rounded-lg transition-all shadow-sm disabled:opacity-50"
                                                >
                                                    {processingId === log.id ? (
                                                        "Processing..."
                                                    ) : (
                                                        <>
                                                            <Icon
                                                                icon="solar:logout-2-bold-duotone"
                                                                className="w-4 h-4"
                                                            />
                                                            Force Time Out
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {visitorLogs.links && visitorLogs.total > 15 && (
                    <div className="bg-slate-50 border-t border-stone-100 px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
                        <p className="text-[11px] text-stone-500 font-medium">
                            Showing{" "}
                            <span className="font-bold text-slate-700">
                                {visitorLogs.from}
                            </span>{" "}
                            to{" "}
                            <span className="font-bold text-slate-700">
                                {visitorLogs.to}
                            </span>{" "}
                            of{" "}
                            <span className="font-bold text-slate-700">
                                {visitorLogs.total}
                            </span>{" "}
                            records
                        </p>
                        <div className="flex items-center gap-1">
                            {visitorLogs.links.map((link: any, i: number) => (
                                <Link
                                    key={i}
                                    href={link.url || "#"}
                                    data={{ history: isHistoryMode }}
                                    preserveState
                                    className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors ${
                                        link.active
                                            ? "bg-emerald-500 text-white shadow-sm shadow-emerald-200"
                                            : "bg-white text-slate-500 border border-slate-200 hover:border-emerald-300 hover:text-emerald-600"
                                    } ${!link.url && "opacity-50 cursor-not-allowed"}`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Dialog
                open={isLogoutModalOpen}
                onOpenChange={setIsLogoutModalOpen}
            >
                <DialogContent className="sm:max-w-sm bg-white rounded-2xl border-rose-100 shadow-xl shadow-stone-200/50">
                    <DialogHeader>
                        <DialogTitle className="text-rose-600 font-black text-lg flex items-center gap-2">
                            <Icon
                                icon="solar:danger-triangle-bold-duotone"
                                className="w-6 h-6"
                            />{" "}
                            Force Logout
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500 font-medium mt-2">
                            Are you sure you want to forcibly log this user out?
                            Their time out will be recorded as right now.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-4">
                        <button
                            type="button"
                            onClick={() => setIsLogoutModalOpen(false)}
                            className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors border border-stone-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={confirmLogout}
                            disabled={processingId !== null}
                            className="px-4 py-2 text-sm font-bold bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-md shadow-rose-200 transition-all border-none disabled:opacity-50"
                        >
                            {processingId !== null
                                ? "Logging out..."
                                : "Confirm Logout"}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
