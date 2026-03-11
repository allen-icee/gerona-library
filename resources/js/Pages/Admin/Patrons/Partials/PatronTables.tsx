// resources/js/Pages/Admin/Patrons/Partials/PatronsTable.tsx

import { Icon } from "@iconify/react";
import { Link } from "@inertiajs/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import PatronActions from "./PatronActions";

export default function PatronsTable({ patrons, onPrint }: { patrons: any, onPrint: (patron: any) => void }) {
    return (
        <div className="bg-white border border-fuchsia-100 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="bg-fuchsia-50/50 border-b border-fuchsia-100 px-4 py-3 flex items-center gap-2">
                <Icon icon="solar:users-group-rounded-bold-duotone" className="w-5 h-5 text-fuchsia-500" />
                <h2 className="text-sm font-bold text-slate-800">Registered Patrons</h2>
            </div>

            <div className="flex-1 overflow-x-auto">
                <Table>
                    <TableHeader className="bg-white hover:bg-white border-b border-fuchsia-50">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="text-[10px] uppercase text-stone-400 font-bold tracking-wider pl-6">Card Number</TableHead>
                            <TableHead className="text-[10px] uppercase text-stone-400 font-bold tracking-wider">Name</TableHead>
                            <TableHead className="text-[10px] uppercase text-stone-400 font-bold tracking-wider">Type</TableHead>
                            <TableHead className="text-[10px] uppercase text-stone-400 font-bold tracking-wider">Address</TableHead>
                            <TableHead className="text-[10px] uppercase text-stone-400 font-bold tracking-wider text-center">Status</TableHead>
                            <TableHead className="text-[10px] uppercase text-stone-400 font-bold tracking-wider text-right pr-6">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {patrons.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-xs text-stone-400 font-medium">
                                    No patrons found in the registry.
                                </TableCell>
                            </TableRow>
                        ) : (
                            patrons.data.map((patron: any) => (
                                <TableRow key={patron.id} className={`hover:bg-fuchsia-50/30 transition-colors border-fuchsia-50 ${patron.status === "Suspended" ? "opacity-60 bg-stone-50/50" : ""}`}>
                                    <TableCell className="pl-6 py-3 font-mono text-slate-700 text-xs font-semibold">
                                        <span className="bg-stone-100 px-2 py-1 rounded-md border border-stone-200">{patron.library_card_number}</span>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <p className="font-bold text-slate-800 text-sm">{patron.first_name} {patron.last_name}</p>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200">
                                            {patron.type}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <p className="text-xs text-stone-500 font-medium truncate max-w-[200px]" title={`${patron.barangay}, ${patron.municipality}`}>
                                            {patron.barangay}, {patron.municipality}
                                        </p>
                                    </TableCell>
                                    <TableCell className="py-3 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide border ${patron.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                                            {patron.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right pr-6 py-3">
                                        <PatronActions patron={patron} onPrint={() => onPrint(patron)} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {patrons.total > 15 && (
                <div className="bg-slate-50 border-t border-stone-100 px-6 py-3 flex items-center justify-between">
                    <p className="text-[11px] text-stone-500 font-medium uppercase tracking-wider">
                        Showing {patrons.from} to {patrons.to} of {patrons.total} entries
                    </p>
                    <div className="flex items-center gap-1">
                        {patrons.links.map((link: any, index: number) => (
                            <Link
                                key={index}
                                href={link.url || "#"}
                                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors ${link.active
                                        ? "bg-fuchsia-500 text-white shadow-sm shadow-fuchsia-200"
                                        : "bg-white text-slate-500 border border-slate-200 hover:border-fuchsia-300 hover:text-fuchsia-500"
                                    } ${!link.url && "opacity-50 cursor-not-allowed"}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}