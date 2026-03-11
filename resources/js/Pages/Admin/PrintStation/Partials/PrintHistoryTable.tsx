import { Icon } from "@iconify/react";
import { Link } from "@inertiajs/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";

export default function PrintHistoryTable({ logs }: { logs: any }) {
    return (
        <div className="bg-white border border-pink-100 shadow-sm shadow-pink-100/50 rounded-xl overflow-hidden flex flex-col h-full">

            {/* Header */}
            <div className="bg-pink-50/50 border-b border-pink-100 px-4 py-3 flex items-center gap-2">
                <Icon icon="solar:history-bold-duotone" className="w-5 h-5 text-pink-500" />
                <h2 className="text-sm font-bold text-slate-800">Historical Logs</h2>
            </div>

            {/* Shadcn Table */}
            <div className="flex-1 overflow-x-auto">
                <Table>
                    <TableHeader className="bg-white hover:bg-white border-b border-pink-50">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="text-[10px] uppercase text-stone-400 font-bold tracking-wider pl-4">Visitor</TableHead>
                            <TableHead className="text-[10px] uppercase text-stone-400 font-bold tracking-wider text-center">Papers</TableHead>
                            <TableHead className="text-[10px] uppercase text-stone-400 font-bold tracking-wider text-right pr-4">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs?.data?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="h-32 text-center text-xs text-slate-400 font-medium">
                                    No print records logged yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            logs?.data?.map((log: any) => (
                                <TableRow key={log.id} className="hover:bg-pink-50/30 transition-colors border-pink-50">
                                    <TableCell className="pl-4 py-3">
                                        <p className="font-bold text-slate-800 text-xs truncate max-w-[120px]">{log.visitor_name}</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[120px]">{log.school_or_barangay}</p>
                                        <p className="text-[9px] text-pink-400 mt-1 flex items-center gap-1 font-medium">
                                            <Icon icon="solar:shield-user-bold-duotone" className="w-3 h-3" />
                                            {log.logger?.name}
                                        </p>
                                    </TableCell>
                                    <TableCell className="text-center py-3">
                                        <span className="bg-pink-50 text-pink-600 border border-pink-100 px-2 py-0.5 rounded text-[10px] font-black">
                                            {log.pages_printed}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right pr-4 py-3 text-[10px] text-slate-500 font-medium whitespace-nowrap">
                                        {new Date(log.printed_at).toLocaleDateString([], {
                                            month: "short", day: "numeric", year: "numeric"
                                        })}
                                        <span className="block text-slate-400 mt-0.5">
                                            {new Date(log.printed_at).toLocaleTimeString([], {
                                                hour: "2-digit", minute: "2-digit"
                                            })}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {logs?.links && logs.links.length > 3 && (
                <div className="bg-slate-50 border-t border-stone-100 px-4 py-3 flex items-center justify-center gap-1 flex-wrap">
                    {logs.links.map((link: any, i: number) => (
                        <Link
                            key={i}
                            href={link.url || "#"}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors ${link.active
                                ? "bg-pink-500 text-white shadow-sm shadow-pink-200"
                                : "bg-white text-slate-500 border border-slate-200 hover:border-pink-300 hover:text-pink-500"
                                } ${!link.url && "opacity-50 cursor-not-allowed"}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}