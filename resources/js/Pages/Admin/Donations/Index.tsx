import { useState, FormEventHandler } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { PageProps } from "@/types";
import {
    Gift,
    BookHeart,
    Monitor,
    PhilippinePeso,
    Plus,
    Trash2,
} from "lucide-react";
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

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this donation record?")) {
            router.delete(route("donations.destroy", id), {
                preserveScroll: true,
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
            <Head title="LGU Donations Tracker" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header & Actions Button */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-stone-800">
                            LGU Donations Tracker
                        </h1>
                        <p className="text-stone-500 text-sm">
                            Log and audit grants, books, and equipment gifted to
                            the library.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <a
                            href={route("donations.export")}
                            className="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-bold transition-colors bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg shadow-sm whitespace-nowrap"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2"
                            >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" x2="12" y1="15" y2="3" />
                            </svg>
                            Export Donations
                        </a>

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
                                <Button className="bg-amber-600 hover:bg-amber-500 text-white shadow-sm h-10">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Log New Donation
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] bg-white">
                                <DialogHeader>
                                    <DialogTitle>Log LGU Donation</DialogTitle>
                                    <DialogDescription>
                                        Record a new asset or grant given to the
                                        municipal library.
                                    </DialogDescription>
                                </DialogHeader>

                                <form
                                    onSubmit={submitDonation}
                                    className="space-y-4 py-4"
                                >
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="donator_name"
                                            className="text-stone-700"
                                        >
                                            Donator Name / Organization *
                                        </Label>
                                        <Input
                                            id="donator_name"
                                            value={data.donator_name}
                                            onChange={(e) =>
                                                setData(
                                                    "donator_name",
                                                    e.target.value,
                                                )
                                            }
                                            required
                                            placeholder="e.g., Mayor Dela Cruz or Rotary Club"
                                            autoFocus
                                        />
                                        {errors.donator_name && (
                                            <p className="text-sm text-red-600">
                                                {errors.donator_name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="donator_type"
                                                className="text-stone-700"
                                            >
                                                Donator Type
                                            </Label>
                                            <select
                                                id="donator_type"
                                                value={data.donator_type}
                                                onChange={(e) =>
                                                    setData(
                                                        "donator_type",
                                                        e.target.value,
                                                    )
                                                }
                                                className="flex h-9 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm shadow-sm"
                                            >
                                                <option value="Individual">
                                                    Individual
                                                </option>
                                                <option value="LGU Official">
                                                    LGU Official
                                                </option>
                                                <option value="NGO / Foundation">
                                                    NGO / Foundation
                                                </option>
                                                <option value="Private Company">
                                                    Private Company
                                                </option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="donation_category"
                                                className="text-stone-700"
                                            >
                                                Category
                                            </Label>
                                            <select
                                                id="donation_category"
                                                value={data.donation_category}
                                                onChange={(e) =>
                                                    setData(
                                                        "donation_category",
                                                        e.target.value,
                                                    )
                                                }
                                                className="flex h-9 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm shadow-sm"
                                            >
                                                <option value="Books">
                                                    Books / Literature
                                                </option>
                                                <option value="Equipment">
                                                    Computers / Equipment
                                                </option>
                                                <option value="Furniture">
                                                    Furniture
                                                </option>
                                                <option value="Cash Grant">
                                                    Cash Grant
                                                </option>
                                                <option value="Other">
                                                    Other
                                                </option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="description"
                                            className="text-stone-700"
                                        >
                                            Item Description *
                                        </Label>
                                        <Input
                                            id="description"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value,
                                                )
                                            }
                                            required
                                            placeholder="e.g., 50 Assorted Filipiniana Books"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="estimated_value"
                                                className="text-stone-700"
                                            >
                                                Est. Value (₱){" "}
                                                <span className="text-stone-400 font-normal text-xs">
                                                    (Optional)
                                                </span>
                                            </Label>
                                            <Input
                                                id="estimated_value"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.estimated_value}
                                                onChange={(e) =>
                                                    setData(
                                                        "estimated_value",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="date_received"
                                                className="text-stone-700"
                                            >
                                                Date Received *
                                            </Label>
                                            <Input
                                                id="date_received"
                                                type="date"
                                                value={data.date_received}
                                                onChange={(e) =>
                                                    setData(
                                                        "date_received",
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                    </div>

                                    <DialogFooter className="pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                setIsAddModalOpen(false)
                                            }
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-amber-600 hover:bg-amber-500 text-white"
                                        >
                                            {processing
                                                ? "Saving..."
                                                : "Save Record"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="shadow-sm border-stone-200">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-stone-500">
                                Total Est. Value
                            </CardTitle>
                            <PhilippinePeso className="w-5 h-5 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-stone-800">
                                {formatPHP(totals.total_value)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-stone-200">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-stone-500">
                                Total Logged Items
                            </CardTitle>
                            <Gift className="w-5 h-5 text-amber-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-stone-800">
                                {totals.total_donations}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-stone-200">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-stone-500">
                                Book Donors
                            </CardTitle>
                            <BookHeart className="w-5 h-5 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-stone-800">
                                {totals.book_donations}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-stone-200">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-stone-500">
                                Equipment Grants
                            </CardTitle>
                            <Monitor className="w-5 h-5 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-stone-800">
                                {totals.equipment_donations}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Donations Data Table */}
                <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-stone-50">
                            <TableRow>
                                <TableHead className="font-semibold text-stone-700">
                                    Donator
                                </TableHead>
                                <TableHead className="font-semibold text-stone-700">
                                    Category & Item
                                </TableHead>
                                <TableHead className="font-semibold text-stone-700">
                                    Value
                                </TableHead>
                                <TableHead className="font-semibold text-stone-700">
                                    Date Received
                                </TableHead>
                                <TableHead className="font-semibold text-stone-700 w-[80px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {donations.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="h-32 text-center text-stone-500"
                                    >
                                        No donations logged yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                donations.data.map((donation: any) => (
                                    <TableRow
                                        key={donation.id}
                                        className="hover:bg-stone-50 transition-colors"
                                    >
                                        <TableCell>
                                            <p className="font-medium text-slate-900">
                                                {donation.donator_name}
                                            </p>
                                            <p className="text-xs text-stone-500">
                                                {donation.donator_type}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-stone-100 text-stone-700 mb-1">
                                                {donation.donation_category}
                                            </span>
                                            <p className="text-sm text-stone-600">
                                                {donation.description}
                                            </p>
                                        </TableCell>
                                        <TableCell className="font-medium text-emerald-700">
                                            {donation.estimated_value
                                                ? formatPHP(
                                                      donation.estimated_value,
                                                  )
                                                : "-"}
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-sm text-stone-800">
                                                {new Date(
                                                    donation.date_received,
                                                ).toLocaleDateString()}
                                            </p>
                                            <p className="text-xs text-stone-400">
                                                Logged by{" "}
                                                {donation.receiver?.name}
                                            </p>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleDelete(donation.id)
                                                }
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AdminLayout>
    );
}
