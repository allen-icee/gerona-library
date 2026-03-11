import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Icon } from "@iconify/react";
import { useState } from "react";
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

import AddCopyModal from "./Partials/AddCopyModal";

export default function BookCopies({
    book,
    copies,
}: PageProps<{ book: any; copies: any[] }>) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [copyToDelete, setCopyToDelete] = useState<number | null>(null);

    const confirmDelete = () => {
        if (copyToDelete !== null) {
            router.delete(route("copies.destroy", copyToDelete), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setCopyToDelete(null);
                }
            });
        }
    };

    return (
        <AdminLayout>
            <Head title={`Copies - ${book.title}`} />

            <div className="max-w-6xl mx-auto space-y-6">

                {/* COMPACT HEADER */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-pink-100 shadow-sm shadow-pink-100/50">
                    <div className="space-y-1.5">
                        <Link
                            href={route("books.index")}
                            className="text-xs font-bold text-pink-500 hover:text-pink-600 flex items-center transition-colors w-fit bg-pink-50 px-2 py-1 rounded-md"
                        >
                            <Icon icon="solar:arrow-left-bold-duotone" className="w-3.5 h-3.5 mr-1" /> Back to Master Catalog
                        </Link>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2 mt-2">
                            {book.title}
                        </h1>
                        <p className="text-slate-500 text-sm font-medium">
                            By {book.author} <span className="text-stone-300 mx-1">|</span> ISBN: {book.isbn || "N/A"}
                        </p>
                    </div>

                    <div className="w-full sm:w-auto mt-2 sm:mt-0">
                        <AddCopyModal bookId={book.id} />
                    </div>
                </div>

                {/* DATA TABLE */}
                <div className="bg-white border border-pink-100 rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-white hover:bg-white border-b border-pink-50">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="text-[10px] uppercase text-stone-400 font-bold tracking-wider pl-6">Accession Number</TableHead>
                                    <TableHead className="text-[10px] uppercase text-stone-400 font-bold tracking-wider">Status</TableHead>
                                    <TableHead className="text-[10px] uppercase text-stone-400 font-bold tracking-wider">Location</TableHead>
                                    <TableHead className="text-[10px] uppercase text-stone-400 font-bold tracking-wider">Source</TableHead>
                                    <TableHead className="text-[10px] uppercase text-stone-400 font-bold tracking-wider text-right pr-6">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {copies.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-xs text-stone-400 font-medium">
                                            No physical copies registered for this book yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    copies.map((copy) => (
                                        <TableRow key={copy.id} className="hover:bg-pink-50/30 transition-colors border-pink-50">
                                            <TableCell className="font-mono text-slate-800 font-bold flex items-center gap-2 pl-6 py-3">
                                                <Icon icon="solar:qr-code-bold-duotone" className="w-5 h-5 text-pink-400" />
                                                {copy.accession_number}
                                            </TableCell>
                                            <TableCell className="py-3">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-black border ${copy.status === "Available" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                                                    copy.status === "Borrowed" ? "bg-amber-50 text-amber-600 border-amber-200" :
                                                        "bg-red-50 text-red-600 border-red-200"
                                                    }`}>
                                                    {copy.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-stone-600 font-medium text-sm py-3">
                                                {copy.shelf_location || "-"}
                                            </TableCell>
                                            <TableCell className="text-stone-600 font-medium text-sm py-3">
                                                {copy.source}
                                                {copy.source === "Donated" && copy.donator_name && (
                                                    <span className="block text-[10px] text-pink-500 font-bold mt-0.5">
                                                        from {copy.donator_name}
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right pr-6 py-3">
                                                <button
                                                    onClick={() => {
                                                        setCopyToDelete(copy.id);
                                                        setIsDeleteModalOpen(true);
                                                    }}
                                                    className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Copy"
                                                >
                                                    <Icon icon="solar:trash-bin-trash-bold" className="w-5 h-5" />
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* CUSTOM DISCARD MODAL */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-sm bg-white rounded-2xl border-red-100 shadow-xl shadow-stone-200/50">
                    <DialogHeader>
                        <DialogTitle className="text-red-600 font-black text-lg flex items-center gap-2">
                            <Icon icon="solar:danger-triangle-bold-duotone" className="w-6 h-6" /> Delete Copy
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500 font-medium mt-2">
                            Are you sure you want to permanently delete this physical copy? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-4">
                        <button
                            type="button"
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors border border-stone-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={confirmDelete}
                            className="px-4 py-2 text-sm font-bold bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md shadow-red-200 transition-all border-none"
                        >
                            Delete Copy
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}