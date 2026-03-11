// resources/js/Pages/Admin/Donations/Partials/DonationsTable.tsx

import { useState } from "react";
import { router, Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
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
import EditDonationModal from "./EditDonationModal";

const formatPHP = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
    }).format(amount || 0);
};

export default function DonationsTable({ donations }: { donations: any }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [itemToEdit, setItemToEdit] = useState<any | null>(null);

    const confirmDelete = () => {
        if (itemToDelete !== null) {
            router.delete(route("donations.destroy", itemToDelete), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setItemToDelete(null);
                    // Reverted back to success!
                    toast.success("Donation record deleted successfully.");
                },
                onError: () => {
                    toast.error("Failed to delete the donation record.");
                }
            });
        }
    };

    return (
        <>
            <div className="bg-white border border-fuchsia-100 rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="bg-fuchsia-50/50 border-b border-fuchsia-100 px-4 py-3 flex items-center gap-2">
                    <Icon icon="solar:clipboard-list-bold-duotone" className="w-5 h-5 text-fuchsia-400" />
                    <h2 className="text-sm font-bold text-slate-800">Donation Records</h2>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-white hover:bg-white border-b border-fuchsia-50">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="text-[10px] uppercase text-stone-400 font-bold tracking-wider pl-6">Donator</TableHead>
                                <TableHead className="text-[10px] uppercase text-stone-400 font-bold tracking-wider">Category & Item</TableHead>
                                <TableHead className="text-[10px] uppercase text-stone-400 font-bold tracking-wider">Value</TableHead>
                                <TableHead className="text-[10px] uppercase text-stone-400 font-bold tracking-wider">Date Received</TableHead>
                                <TableHead className="text-[10px] uppercase text-stone-400 font-bold tracking-wider text-right pr-6">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {donations.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-xs text-stone-400 font-medium">
                                        No donations logged yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                donations.data.map((donation: any) => (
                                    <TableRow key={donation.id} className="hover:bg-fuchsia-50/30 transition-colors border-fuchsia-50">
                                        <TableCell className="pl-6 py-3">
                                            <p className="font-bold text-slate-800 text-sm">{donation.donator_name}</p>
                                            <p className="text-[10px] text-stone-500 font-medium mt-0.5">{donation.donator_type}</p>
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-black bg-fuchsia-100 text-fuchsia-700 mb-1 border border-fuchsia-200">
                                                {donation.donation_category}
                                            </span>
                                            <p className="text-sm text-slate-600 font-medium truncate max-w-[250px]" title={donation.description}>
                                                {donation.description}
                                            </p>
                                        </TableCell>
                                        <TableCell className="py-3 font-bold text-emerald-600 text-sm">
                                            {donation.estimated_value ? formatPHP(donation.estimated_value) : <span className="text-stone-300">-</span>}
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <p className="text-sm font-medium text-slate-800">
                                                {new Date(donation.date_received).toLocaleDateString([], {
                                                    month: "short", day: "numeric", year: "numeric"
                                                })}
                                            </p>
                                            <p className="text-[10px] text-fuchsia-400 mt-0.5 flex items-center gap-1 font-medium">
                                                <Icon icon="solar:shield-user-bold-duotone" className="w-3 h-3" />
                                                {donation.receiver?.name}
                                            </p>
                                        </TableCell>
                                        <TableCell className="text-right pr-6 py-3 space-x-2">
                                            <button
                                                onClick={() => setItemToEdit(donation)}
                                                className="p-2 text-stone-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit Record"
                                            >
                                                <Icon icon="solar:pen-bold" className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setItemToDelete(donation.id);
                                                    setIsDeleteModalOpen(true);
                                                }}
                                                className="p-2 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                                title="Delete Record"
                                            >
                                                <Icon icon="solar:trash-bin-trash-bold" className="w-4 h-4" />
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {donations.links && donations.links.length > 3 && (
                    <div className="bg-slate-50 border-t border-stone-100 px-4 py-3 flex items-center justify-center gap-1 flex-wrap">
                        {donations.links.map((link: any, i: number) => (
                            <Link
                                key={i}
                                href={link.url || "#"}
                                className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors ${link.active
                                    ? "bg-fuchsia-500 text-white shadow-sm shadow-fuchsia-200"
                                    : "bg-white text-slate-500 border border-slate-200 hover:border-fuchsia-300 hover:text-fuchsia-500"
                                    } ${!link.url && "opacity-50 cursor-not-allowed"}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* EDIT MODAL */}
            <EditDonationModal
                donation={itemToEdit}
                isOpen={!!itemToEdit}
                onClose={() => setItemToEdit(null)}
            />

            {/* CUSTOM DISCARD MODAL */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-sm bg-white rounded-2xl border-rose-100 shadow-xl shadow-stone-200/50">
                    <DialogHeader>
                        <DialogTitle className="text-rose-600 font-black text-lg flex items-center gap-2">
                            <Icon icon="solar:danger-triangle-bold-duotone" className="w-6 h-6" /> Delete Record
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500 font-medium mt-2">
                            Are you sure you want to delete this donation record? This action will permanently remove it from the database and adjust the totals.
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
                            className="px-4 py-2 text-sm font-bold bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-md shadow-rose-200 transition-all border-none"
                        >
                            Delete Record
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}