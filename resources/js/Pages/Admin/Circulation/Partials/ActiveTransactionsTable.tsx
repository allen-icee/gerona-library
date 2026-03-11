import { useState } from "react";
import { router } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/Components/ui/dialog";

export default function ActiveTransactionsTable({ transactions }: { transactions: any[] }) {
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [transactionToReturn, setTransactionToReturn] = useState<number | null>(null);

    const confirmReturn = () => {
        if (transactionToReturn !== null) {
            router.patch(
                route("circulation.return", transactionToReturn),
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setIsReturnModalOpen(false);
                        setTransactionToReturn(null);
                    }
                }
            );
        }
    };

    return (
        <>
            <div className="bg-white border border-rose-100 shadow-sm shadow-rose-100/50 rounded-xl overflow-hidden flex flex-col h-full">

                <div className="bg-rose-50/50 border-b border-rose-100 px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Icon icon="solar:clipboard-list-bold-duotone" className="w-5 h-5 text-rose-500" />
                        <div>
                            <h2 className="text-sm font-bold text-slate-800 leading-tight">Active Borrowings</h2>
                            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Items currently checked out by patrons.</p>
                        </div>
                    </div>
                    <span className="bg-rose-100 text-rose-700 text-[10px] font-black px-2.5 py-1 rounded-full border border-rose-200">
                        {transactions.length} Active
                    </span>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-white hover:bg-white border-b border-rose-50">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="text-[10px] uppercase text-stone-400 font-bold tracking-wider pl-5">Patron</TableHead>
                                <TableHead className="text-[10px] uppercase text-stone-400 font-bold tracking-wider">Book Details</TableHead>
                                <TableHead className="text-[10px] uppercase text-stone-400 font-bold tracking-wider">Due Date</TableHead>
                                <TableHead className="text-[10px] uppercase text-stone-400 font-bold tracking-wider text-right pr-5">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-48 text-center text-xs text-stone-400 font-medium">
                                        <Icon icon="solar:ghost-smile-bold-duotone" className="w-10 h-10 text-rose-200 mx-auto mb-2" />
                                        No active transactions. All books are checked in!
                                    </TableCell>
                                </TableRow>
                            ) : (
                                transactions.map((transaction) => {
                                    const isOverdue = new Date(transaction.due_at) < new Date();

                                    return (
                                        <TableRow key={transaction.id} className={`transition-colors border-rose-50 ${isOverdue ? "bg-red-50/30 hover:bg-red-50/50" : "hover:bg-rose-50/30"}`}>
                                            <TableCell className="pl-5 py-3">
                                                <p className="font-bold text-slate-800 text-sm">
                                                    {transaction.patron.first_name} {transaction.patron.last_name}
                                                </p>
                                                <p className="text-[10px] text-stone-500 font-medium mt-0.5 flex items-center gap-1.5">
                                                    <Icon icon="solar:card-bold-duotone" className="w-3 h-3 text-rose-400" />
                                                    {transaction.patron.library_card_number}
                                                </p>
                                            </TableCell>
                                            <TableCell className="py-3">
                                                <p className="font-bold text-slate-700 text-sm line-clamp-1 max-w-[250px]" title={transaction.book_copy.book.title}>
                                                    {transaction.book_copy.book.title}
                                                </p>
                                                <div className="mt-1.5">
                                                    <span className="bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded border border-stone-200 text-[10px] font-bold tracking-wide">
                                                        {transaction.book_copy.accession_number}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black border ${isOverdue ? "bg-red-100 text-red-700 border-red-200" : "bg-stone-100 text-stone-600 border-stone-200"}`}>
                                                    {new Date(transaction.due_at).toLocaleDateString([], {
                                                        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                                                    })}
                                                    {isOverdue && " (Overdue)"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right pr-5 py-3">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setTransactionToReturn(transaction.id);
                                                        setIsReturnModalOpen(true);
                                                    }}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-500 hover:text-white border border-emerald-100 rounded-lg transition-all shadow-sm"
                                                >
                                                    <Icon icon="solar:refresh-circle-bold-duotone" className="w-4 h-4" />
                                                    Return
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* CUSTOM RETURN MODAL */}
            <Dialog open={isReturnModalOpen} onOpenChange={setIsReturnModalOpen}>
                <DialogContent className="sm:max-w-sm bg-white rounded-2xl border-emerald-100 shadow-xl shadow-stone-200/50">
                    <DialogHeader>
                        <DialogTitle className="text-emerald-600 font-black text-lg flex items-center gap-2">
                            <Icon icon="solar:check-circle-bold-duotone" className="w-6 h-6" /> Confirm Return
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500 font-medium mt-2">
                            Are you sure you want to mark this book as returned? This will update the system and mark the physical copy as Available.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-4">
                        <button
                            type="button"
                            onClick={() => setIsReturnModalOpen(false)}
                            className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors border border-stone-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={confirmReturn}
                            className="px-4 py-2 text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-200 transition-all border-none"
                        >
                            Confirm Return
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}