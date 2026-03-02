import { FormEventHandler } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { BookUp, Undo2, AlertCircle, CalendarClock } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";

export default function CirculationIndex({
    activeTransactions,
    patrons,
    availableCopies,
}: PageProps<{
    activeTransactions: any[];
    patrons: any[];
    availableCopies: any[];
}>) {
    // Set default due date to 7 days from today
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 7);
    const defaultDueString =
        defaultDueDate.toISOString().split("T")[0] + "T17:00"; // Default 5 PM

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            patron_id: "",
            book_copy_id: "",
            due_at: defaultDueString,
        });

    const submitCheckout: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("circulation.checkout"), {
            preserveScroll: true,
            onSuccess: () => {
                reset("book_copy_id"); // Only reset the book, keep the patron in case they are borrowing multiple!
                clearErrors();
            },
        });
    };

    const handleReturn = (transactionId: number) => {
        if (
            confirm(
                "Confirm book return? This will mark the physical copy as Available again.",
            )
        ) {
            router.patch(
                route("circulation.return", transactionId),
                {},
                { preserveScroll: true },
            );
        }
    };

    return (
        <AdminLayout>
            <Head title="Circulation Desk" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header with Export Button */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-stone-800">
                            Circulation Desk
                        </h1>
                        <p className="text-stone-500 text-sm">
                            Process checkouts, returns, and track active library
                            assets.
                        </p>
                    </div>

                    <a
                        href={route("circulation.export")}
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
                        Export Circulation Logs
                    </a>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* ================= LEFT COLUMN: CHECKOUT FORM ================= */}
                    <Card className="lg:col-span-1 shadow-sm border-stone-200">
                        <CardHeader className="bg-slate-900 text-white rounded-t-lg">
                            <CardTitle className="flex items-center text-lg">
                                <BookUp className="w-5 h-5 mr-2 text-amber-500" />
                                Check Out Material
                            </CardTitle>
                            <CardDescription className="text-slate-300">
                                Scan or select items to issue.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form
                                onSubmit={submitCheckout}
                                className="space-y-5"
                            >
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="patron_id"
                                        className="text-stone-700 font-semibold"
                                    >
                                        1. Select Patron *
                                    </Label>
                                    <select
                                        id="patron_id"
                                        value={data.patron_id}
                                        onChange={(e) =>
                                            setData("patron_id", e.target.value)
                                        }
                                        className="flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                                        required
                                    >
                                        <option value="" disabled>
                                            Search library card or name...
                                        </option>
                                        {patrons.map((patron) => (
                                            <option
                                                key={patron.id}
                                                value={patron.id}
                                            >
                                                {patron.last_name},{" "}
                                                {patron.first_name} (
                                                {patron.library_card_number})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.patron_id && (
                                        <p className="text-sm text-red-600 flex items-center">
                                            <AlertCircle className="w-3 h-3 mr-1" />{" "}
                                            {errors.patron_id}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="book_copy_id"
                                        className="text-stone-700 font-semibold"
                                    >
                                        2. Scan Physical Copy *
                                    </Label>
                                    <select
                                        id="book_copy_id"
                                        value={data.book_copy_id}
                                        onChange={(e) =>
                                            setData(
                                                "book_copy_id",
                                                e.target.value,
                                            )
                                        }
                                        className="flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                                        required
                                    >
                                        <option value="" disabled>
                                            Scan barcode or select book...
                                        </option>
                                        {availableCopies.map((copy) => (
                                            <option
                                                key={copy.id}
                                                value={copy.id}
                                            >
                                                [{copy.accession_number}] -{" "}
                                                {copy.book.title}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.book_copy_id && (
                                        <p className="text-sm text-red-600 flex items-center">
                                            <AlertCircle className="w-3 h-3 mr-1" />{" "}
                                            {errors.book_copy_id}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="due_at"
                                        className="text-stone-700 font-semibold flex items-center"
                                    >
                                        <CalendarClock className="w-4 h-4 mr-2 text-stone-500" />{" "}
                                        3. Set Due Date *
                                    </Label>
                                    <Input
                                        id="due_at"
                                        type="datetime-local"
                                        value={data.due_at}
                                        onChange={(e) =>
                                            setData("due_at", e.target.value)
                                        }
                                        required
                                        className="bg-white"
                                    />
                                    {errors.due_at && (
                                        <p className="text-sm text-red-600 flex items-center">
                                            <AlertCircle className="w-3 h-3 mr-1" />{" "}
                                            {errors.due_at}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold text-base h-12 shadow-md"
                                >
                                    {processing
                                        ? "Processing..."
                                        : "Issue Book"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* ================= RIGHT COLUMN: ACTIVE TRANSACTIONS ================= */}
                    <Card className="lg:col-span-2 shadow-sm border-stone-200">
                        <CardHeader className="bg-white border-b border-stone-100">
                            <CardTitle className="text-lg text-stone-800">
                                Active Borrowings
                            </CardTitle>
                            <CardDescription>
                                Items currently checked out by patrons.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-stone-50">
                                    <TableRow>
                                        <TableHead className="font-semibold text-stone-700">
                                            Patron
                                        </TableHead>
                                        <TableHead className="font-semibold text-stone-700">
                                            Book Details
                                        </TableHead>
                                        <TableHead className="font-semibold text-stone-700">
                                            Due Date
                                        </TableHead>
                                        <TableHead className="font-semibold text-stone-700 text-right">
                                            Action
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {activeTransactions.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={4}
                                                className="h-48 text-center text-stone-500"
                                            >
                                                No active transactions. All
                                                books are checked in!
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        activeTransactions.map(
                                            (transaction) => {
                                                const isOverdue =
                                                    new Date(
                                                        transaction.due_at,
                                                    ) < new Date();

                                                return (
                                                    <TableRow
                                                        key={transaction.id}
                                                        className={`hover:bg-stone-50 transition-colors ${isOverdue ? "bg-red-50/50" : ""}`}
                                                    >
                                                        <TableCell>
                                                            <p className="font-medium text-slate-900">
                                                                {
                                                                    transaction
                                                                        .patron
                                                                        .first_name
                                                                }{" "}
                                                                {
                                                                    transaction
                                                                        .patron
                                                                        .last_name
                                                                }
                                                            </p>
                                                            <p className="text-xs text-stone-500 font-mono">
                                                                {
                                                                    transaction
                                                                        .patron
                                                                        .library_card_number
                                                                }
                                                            </p>
                                                        </TableCell>
                                                        <TableCell>
                                                            <p className="font-medium text-stone-800 line-clamp-1">
                                                                {
                                                                    transaction
                                                                        .book_copy
                                                                        .book
                                                                        .title
                                                                }
                                                            </p>
                                                            <p className="text-xs text-stone-500 font-mono flex items-center mt-1">
                                                                <span className="bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded mr-2">
                                                                    {
                                                                        transaction
                                                                            .book_copy
                                                                            .accession_number
                                                                    }
                                                                </span>
                                                            </p>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span
                                                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${isOverdue ? "bg-red-100 text-red-800 border border-red-200" : "bg-stone-100 text-stone-700"}`}
                                                            >
                                                                {new Date(
                                                                    transaction.due_at,
                                                                ).toLocaleDateString(
                                                                    [],
                                                                    {
                                                                        month: "short",
                                                                        day: "numeric",
                                                                        hour: "2-digit",
                                                                        minute: "2-digit",
                                                                    },
                                                                )}
                                                                {isOverdue &&
                                                                    " (Overdue)"}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                onClick={() =>
                                                                    handleReturn(
                                                                        transaction.id,
                                                                    )
                                                                }
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
                                                            >
                                                                <Undo2 className="w-4 h-4 mr-1.5" />{" "}
                                                                Return
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            },
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
