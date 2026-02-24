import { useState, FormEventHandler } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { PageProps } from "@/types";
import { ArrowLeft, Plus, Trash2, Barcode } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
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

export default function BookCopies({
    book,
    copies,
}: PageProps<{ book: any; copies: any[] }>) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            accession_number: "",
            shelf_location: "",
            status: "Available",
            source: "Purchased",
            donator_name: "",
            date_acquired: new Date().toISOString().split("T")[0], // Defaults to today
            remarks: "",
        });

    const submitNewCopy: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("books.copies.store", book.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsAddModalOpen(false);
                reset();
            },
        });
    };

    const handleDelete = (id: number) => {
        if (
            confirm(
                "Are you sure you want to delete this physical copy? This action cannot be undone.",
            )
        ) {
            router.delete(route("copies.destroy", id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout>
            <Head title={`Copies - ${book.title}`} />

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header Area */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                        <Link
                            href={route("books.index")}
                            className="text-sm font-medium text-amber-600 hover:text-amber-700 flex items-center mb-2"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" /> Back to
                            Master Catalog
                        </Link>
                        <h1 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
                            {book.title}
                        </h1>
                        <p className="text-stone-500 text-sm">
                            By {book.author} | ISBN: {book.isbn || "N/A"}
                        </p>
                    </div>

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
                            <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Physical Copy
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] bg-white">
                            <DialogHeader>
                                <DialogTitle>Add Accession Number</DialogTitle>
                                <DialogDescription>
                                    Register a physical barcode or copy of this
                                    book into circulation.
                                </DialogDescription>
                            </DialogHeader>

                            <form
                                onSubmit={submitNewCopy}
                                className="space-y-4 py-4"
                            >
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="accession_number"
                                        className="text-stone-700"
                                    >
                                        Accession Number (Barcode) *
                                    </Label>
                                    <div className="relative">
                                        <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                                        <Input
                                            id="accession_number"
                                            className="pl-9"
                                            value={data.accession_number}
                                            onChange={(e) =>
                                                setData(
                                                    "accession_number",
                                                    e.target.value,
                                                )
                                            }
                                            required
                                            autoFocus
                                            placeholder="Scan or type barcode..."
                                        />
                                    </div>
                                    {errors.accession_number && (
                                        <p className="text-sm text-red-600">
                                            {errors.accession_number}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="shelf_location"
                                            className="text-stone-700"
                                        >
                                            Shelf Location
                                        </Label>
                                        <Input
                                            id="shelf_location"
                                            value={data.shelf_location}
                                            onChange={(e) =>
                                                setData(
                                                    "shelf_location",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="e.g. Shelf A2"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="status"
                                            className="text-stone-700"
                                        >
                                            Initial Status
                                        </Label>
                                        <select
                                            id="status"
                                            value={data.status}
                                            onChange={(e) =>
                                                setData(
                                                    "status",
                                                    e.target.value,
                                                )
                                            }
                                            className="flex h-9 w-full items-center justify-between rounded-md border border-stone-200 bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-stone-950"
                                        >
                                            <option value="Available">
                                                Available
                                            </option>
                                            <option value="Maintenance">
                                                Maintenance
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="source"
                                            className="text-stone-700"
                                        >
                                            Source
                                        </Label>
                                        <select
                                            id="source"
                                            value={data.source}
                                            onChange={(e) =>
                                                setData(
                                                    "source",
                                                    e.target.value,
                                                )
                                            }
                                            className="flex h-9 w-full items-center justify-between rounded-md border border-stone-200 bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-stone-950"
                                        >
                                            <option value="Purchased">
                                                Purchased
                                            </option>
                                            <option value="LGU Grant">
                                                LGU Grant
                                            </option>
                                            <option value="Donated">
                                                Donated
                                            </option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="date_acquired"
                                            className="text-stone-700"
                                        >
                                            Date Acquired
                                        </Label>
                                        <Input
                                            id="date_acquired"
                                            type="date"
                                            value={data.date_acquired}
                                            onChange={(e) =>
                                                setData(
                                                    "date_acquired",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                {data.source === "Donated" && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <Label
                                            htmlFor="donator_name"
                                            className="text-amber-700 font-semibold"
                                        >
                                            Donator Name
                                        </Label>
                                        <Input
                                            id="donator_name"
                                            className="border-amber-200 focus-visible:ring-amber-500"
                                            value={data.donator_name}
                                            onChange={(e) =>
                                                setData(
                                                    "donator_name",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Who donated this?"
                                        />
                                    </div>
                                )}

                                <DialogFooter className="pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsAddModalOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-amber-600 hover:bg-amber-500 text-white"
                                    >
                                        {processing ? "Saving..." : "Save Copy"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Copies Data Table */}
                <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-stone-50">
                            <TableRow>
                                <TableHead className="font-semibold text-stone-700">
                                    Accession Number
                                </TableHead>
                                <TableHead className="font-semibold text-stone-700">
                                    Status
                                </TableHead>
                                <TableHead className="font-semibold text-stone-700">
                                    Location
                                </TableHead>
                                <TableHead className="font-semibold text-stone-700">
                                    Source
                                </TableHead>
                                <TableHead className="font-semibold text-stone-700 w-[80px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {copies.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="h-32 text-center text-stone-500"
                                    >
                                        No physical copies registered for this
                                        book yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                copies.map((copy) => (
                                    <TableRow
                                        key={copy.id}
                                        className="hover:bg-stone-50 transition-colors"
                                    >
                                        <TableCell className="font-mono text-slate-900 font-medium flex items-center gap-2">
                                            <Barcode className="w-4 h-4 text-stone-400" />{" "}
                                            {copy.accession_number}
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    copy.status === "Available"
                                                        ? "bg-emerald-100 text-emerald-800"
                                                        : copy.status ===
                                                            "Borrowed"
                                                          ? "bg-amber-100 text-amber-800"
                                                          : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {copy.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-stone-600">
                                            {copy.shelf_location || "-"}
                                        </TableCell>
                                        <TableCell className="text-stone-600">
                                            {copy.source}
                                            {copy.source === "Donated" &&
                                                copy.donator_name && (
                                                    <span className="block text-xs text-amber-600">
                                                        from {copy.donator_name}
                                                    </span>
                                                )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleDelete(copy.id)
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
