// resources/js/Pages/Admin/Donations/Index.tsx

import { useState, FormEventHandler } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Icon } from "@iconify/react"; // Switched to Iconify
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
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
    DialogTrigger,
    DialogFooter,
} from "@/Components/ui/dialog";

export default function DonationsIndex({
    donations,
    totals,
}: PageProps<{ donations: any; totals: any }>) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            donator_name: "",
            donator_type: "Individual",
            donation_category: "Books",
            description: "",
            estimated_value: "",
            date_received: new Date().toISOString().split("T")[0],
        });

    const submitDonation: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("donations.store"), {
            preserveScroll: true,
            onSuccess: () => {
                setIsAddModalOpen(false);
                reset();
            },
        });
    };

    const confirmDelete = () => {
        if (itemToDelete !== null) {
            router.delete(route("donations.destroy", itemToDelete), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setItemToDelete(null);
                },
            });
        }
    };

    // Helper to format PHP currency
    const formatPHP = (amount: number) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
        }).format(amount || 0);
    };

    return (
        <AdminLayout>
            <Head title="Donations Tracker" />

            <div className="max-w-full space-y-6">

                {/* COMPACT HEADER (Matches Print Station) */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-fuchsia-100 shadow-sm shadow-fuchsia-100/50">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-fuchsia-300 to-fuchsia-500 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-fuchsia-300/50 text-white">
                            <Icon icon="solar:gift-bold-duotone" className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">
                                Donations Tracker
                            </h1>
                            <p className="text-slate-500 text-xs font-medium mt-1">
                                Log and audit grants, books, and equipment gifted to the library.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href={route("donations.export")}
                            className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold transition-all bg-fuchsia-50 text-fuchsia-600 hover:bg-fuchsia-500 hover:text-white rounded-lg shadow-sm border border-fuchsia-200 group"
                        >
                            <Icon icon="solar:download-square-bold-duotone" className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform" />
                            Export
                        </a>

                        {/* ADD MODAL */}
                        <Dialog
                            open={isAddModalOpen}
                            onOpenChange={(open) => {
                                setIsAddModalOpen(open);
                                if (!open) {
                                    reset();
                                    clearErrors();
                                }
                            }}
                        >
                            <DialogTrigger asChild>
                                <Button className="bg-gradient-to-r from-fuchsia-400 to-fuchsia-500 hover:from-fuchsia-500 hover:to-fuchsia-600 text-white shadow-md shadow-fuchsia-200 border-none font-bold text-xs h-[34px] rounded-lg">
                                    <Icon icon="solar:add-circle-bold-duotone" className="w-4 h-4 mr-2" />
                                    Log Donation
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl border-fuchsia-200 shadow-xl shadow-fuchsia-200/50">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-black text-slate-800 flex items-center gap-2">
                                        <Icon icon="solar:gift-bold-duotone" className="w-6 h-6 text-fuchsia-500" />
                                        Log New Donation
                                    </DialogTitle>
                                    <DialogDescription className="text-xs text-slate-500 font-medium">
                                        Record a new asset or grant given to the municipal library.
                                    </DialogDescription>
                                </DialogHeader>

                                <form onSubmit={submitDonation} className="space-y-4 py-2">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="donator_name" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                            Donator Name / Organization *
                                        </Label>
                                        <Input
                                            id="donator_name"
                                            value={data.donator_name}
                                            onChange={(e) => setData("donator_name", e.target.value)}
                                            required
                                            placeholder="e.g., Mayor Dela Cruz or Rotary Club"
                                            autoFocus
                                            className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500"
                                        />
                                        {errors.donator_name && <p className="text-xs text-red-600 font-medium">{errors.donator_name}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="donator_type" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                                Donator Type
                                            </Label>
                                            <select
                                                id="donator_type"
                                                value={data.donator_type}
                                                onChange={(e) => setData("donator_type", e.target.value)}
                                                className="flex h-10 w-full rounded-md border border-fuchsia-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-fuchsia-500 focus:ring-fuchsia-500"
                                            >
                                                <option value="Individual">Individual</option>
                                                <option value="LGU Official">LGU Official</option>
                                                <option value="NGO / Foundation">NGO / Foundation</option>
                                                <option value="Private Company">Private Company</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="donation_category" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                                Category
                                            </Label>
                                            <select
                                                id="donation_category"
                                                value={data.donation_category}
                                                onChange={(e) => setData("donation_category", e.target.value)}
                                                className="flex h-10 w-full rounded-md border border-fuchsia-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-fuchsia-500 focus:ring-fuchsia-500"
                                            >
                                                <option value="Books">Books / Literature</option>
                                                <option value="Equipment">Computers / Equipment</option>
                                                <option value="Furniture">Furniture</option>
                                                <option value="Cash Grant">Cash Grant</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                            Item Description *
                                        </Label>
                                        <Input
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData("description", e.target.value)}
                                            required
                                            placeholder="e.g., 50 Assorted Filipiniana Books"
                                            className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="estimated_value" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                                Est. Value (₱) <span className="text-stone-400 normal-case tracking-normal">(Optional)</span>
                                            </Label>
                                            <Input
                                                id="estimated_value"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.estimated_value}
                                                onChange={(e) => setData("estimated_value", e.target.value)}
                                                placeholder="0.00"
                                                className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="date_received" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                                Date Received *
                                            </Label>
                                            <Input
                                                id="date_received"
                                                type="date"
                                                value={data.date_received}
                                                onChange={(e) => setData("date_received", e.target.value)}
                                                required
                                                className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500"
                                            />
                                        </div>
                                    </div>

                                    <DialogFooter className="pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsAddModalOpen(false)}
                                            className="rounded-xl font-bold text-slate-500 hover:bg-slate-100"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-gradient-to-r from-fuchsia-400 to-fuchsia-500 hover:from-fuchsia-500 hover:to-fuchsia-600 text-white shadow-md shadow-fuchsia-200 font-bold rounded-xl border-none"
                                        >
                                            {processing ? "Saving..." : "Save Record"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* METRIC CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="shadow-sm border-fuchsia-100 bg-gradient-to-br from-white to-fuchsia-50/30">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-stone-500">
                                Total Est. Value
                            </CardTitle>
                            <Icon icon="solar:wallet-money-bold-duotone" className="w-6 h-6 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-slate-800 tracking-tight">
                                {formatPHP(totals.total_value)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-fuchsia-100 bg-gradient-to-br from-white to-fuchsia-50/30">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-stone-500">
                                Total Logged
                            </CardTitle>
                            <Icon icon="solar:box-minimalistic-bold-duotone" className="w-6 h-6 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-slate-800 tracking-tight">
                                {totals.total_donations}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-fuchsia-100 bg-gradient-to-br from-white to-fuchsia-50/30">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-stone-500">
                                Book Donors
                            </CardTitle>
                            <Icon icon="solar:book-bookmark-bold-duotone" className="w-6 h-6 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-slate-800 tracking-tight">
                                {totals.book_donations}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-fuchsia-100 bg-gradient-to-br from-white to-fuchsia-50/30">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-stone-500">
                                Equipment Grants
                            </CardTitle>
                            <Icon icon="solar:monitor-bold-duotone" className="w-6 h-6 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-slate-800 tracking-tight">
                                {totals.equipment_donations}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* DONATIONS TABLE */}
                <div className="bg-white border border-fuchsia-100 rounded-xl shadow-sm shadow-fuchsia-100/50 overflow-hidden flex flex-col">

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
                                            <TableCell className="text-right pr-6 py-3">
                                                <button
                                                    onClick={() => {
                                                        setItemToDelete(donation.id);
                                                        setIsDeleteModalOpen(true);
                                                    }}
                                                    className="p-1.5 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
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

                    {/* Pagination (Optional if passed via links) */}
                    {donations.links && donations.links.length > 3 && (
                        <div className="bg-slate-50 border-t border-stone-100 px-4 py-3 flex items-center justify-center gap-1 flex-wrap">
                            {/* Assuming standard Inertia Link pagination rendering here if needed */}
                        </div>
                    )}
                </div>
            </div>

            {/* CUSTOM DISCARD MODAL */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-sm bg-white rounded-2xl border-rose-200 shadow-xl shadow-rose-200/50">
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
                            className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
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

        </AdminLayout>
    );
}