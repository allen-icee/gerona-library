//resources\js\Pages\Admin\Books\Copies.tsx
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Icon } from "@iconify/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";

import AddCopyModal from "./Partials/AddCopyModal";
import CopyActions from "./Partials/CopyActions";

export default function BookCopies({ book, copies }: PageProps<{ book: any; copies: any[] }>) {
    return (
        <AdminLayout>
            <Head title={`Copies - ${book.title}`} />
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-pink-100 shadow-sm shadow-pink-100/50">
                    <div className="space-y-1.5">
                        <Link href={route("books.index")} className="text-xs font-bold text-pink-500 hover:text-pink-600 flex items-center bg-pink-50 px-2 py-1 rounded-md w-fit">
                            <Icon icon="solar:arrow-left-bold-duotone" className="w-3.5 h-3.5 mr-1" /> Back to Master Catalog
                        </Link>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2 mt-2">{book.title}</h1>
                        <p className="text-slate-500 text-sm font-medium">By {book.author} <span className="text-stone-300 mx-1">|</span> ISBN: {book.isbn || "N/A"}</p>
                    </div>
                    <div className="w-full sm:w-auto mt-2 sm:mt-0">
                        <AddCopyModal bookId={book.id} />
                    </div>
                </div>

                <div className="bg-white border border-pink-100 rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-white hover:bg-white border-b border-pink-50">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="text-[10px] uppercase text-stone-400 font-bold pl-6">Accession Number</TableHead>
                                    <TableHead className="text-[10px] uppercase text-stone-400 font-bold">Status</TableHead>
                                    <TableHead className="text-[10px] uppercase text-stone-400 font-bold">Location</TableHead>
                                    <TableHead className="text-[10px] uppercase text-stone-400 font-bold">Source</TableHead>
                                    <TableHead className="text-[10px] uppercase text-stone-400 font-bold text-right pr-6">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {copies.length === 0 ? (
                                    <TableRow><TableCell colSpan={5} className="h-32 text-center text-xs text-stone-400">No physical copies registered yet.</TableCell></TableRow>
                                ) : (
                                    copies.map((copy) => (
                                        <TableRow key={copy.id} className="hover:bg-pink-50/30 border-pink-50">
                                            <TableCell className="font-mono text-slate-800 font-bold flex items-center gap-2 pl-6 py-3">
                                                <Icon icon="solar:qr-code-bold-duotone" className="w-5 h-5 text-pink-400" /> {copy.accession_number}
                                            </TableCell>
                                            <TableCell className="py-3">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-black border ${copy.status === "Available" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : copy.status === "Borrowed" ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-red-50 text-red-600 border-red-200"}`}>{copy.status}</span>
                                            </TableCell>
                                            <TableCell className="text-stone-600 text-sm py-3">{copy.shelf_location || "-"}</TableCell>
                                            <TableCell className="text-stone-600 text-sm py-3">
                                                {copy.source}
                                                {copy.source === "Donated" && copy.donator_name && <span className="block text-[10px] text-pink-500 font-bold mt-0.5">from {copy.donator_name}</span>}
                                            </TableCell>
                                            <TableCell className="text-right pr-6 py-3">
                                                <CopyActions copy={copy} />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}