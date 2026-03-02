import { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Input } from "@/Components/ui/input";
import { Search } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";

// Import our new cleanly separated components
import AddBookModal from "./Partials/AddBookModal";
import BookActions from "./Partials/BookActions";

export default function BookIndex({
    books,
    filters,
}: PageProps<{ books: any; filters: { search?: string } }>) {
    const [search, setSearch] = useState(filters.search || "");

    useEffect(() => {
        const delayBounceFn = setTimeout(() => {
            if (search !== filters.search) {
                router.get(
                    route("books.index"),
                    { search },
                    { preserveState: true, replace: true },
                );
            }
        }, 500);
        return () => clearTimeout(delayBounceFn);
    }, [search]);

    return (
        <AdminLayout>
            <Head title="Master Catalog" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Area */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-stone-800">
                            Master Catalog
                        </h1>
                        <p className="text-stone-500 text-sm">
                            Manage master book records and inventory.
                        </p>
                    </div>

                    <div className="flex w-full sm:w-auto items-center gap-3">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                            <Input
                                placeholder="Search title, author, or ISBN..."
                                className="pl-9 bg-white border-stone-300"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        {/* NEW EXPORT BUTTON */}
                        <a
                            href={route("books.export")}
                            className="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium transition-colors bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-md shadow-sm whitespace-nowrap"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
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
                            Export CSV
                        </a>

                        {/* Our isolated Add Book Component */}
                        <AddBookModal />
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-stone-50">
                            <TableRow>
                                <TableHead className="font-semibold text-stone-700">
                                    Title
                                </TableHead>
                                <TableHead className="font-semibold text-stone-700">
                                    Author
                                </TableHead>
                                <TableHead className="font-semibold text-stone-700">
                                    Category
                                </TableHead>
                                <TableHead className="font-semibold text-stone-700 text-center">
                                    Physical Copies
                                </TableHead>
                                <TableHead className="font-semibold text-stone-700 w-[80px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {books.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="h-32 text-center text-stone-500"
                                    >
                                        No books found in the catalog.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                books.data.map((book: any) => (
                                    <TableRow
                                        key={book.id}
                                        className="hover:bg-stone-50 transition-colors"
                                    >
                                        <TableCell className="font-medium text-slate-900">
                                            {book.title}
                                        </TableCell>
                                        <TableCell className="text-stone-600">
                                            {book.author}
                                        </TableCell>
                                        <TableCell className="text-stone-500 text-sm">
                                            {book.category || "-"}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${book.copies_count > 0 ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-600"}`}
                                            >
                                                {book.copies_count} copies
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {/* Our isolated Row Actions Component */}
                                            <BookActions book={book} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Controls */}
                {books.total > 15 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-stone-500">
                            Showing{" "}
                            <span className="font-medium">{books.from}</span> to{" "}
                            <span className="font-medium">{books.to}</span> of{" "}
                            <span className="font-medium">{books.total}</span>{" "}
                            books
                        </p>
                        <div className="flex gap-1">
                            {books.links.map((link: any, index: number) => (
                                <button
                                    key={index}
                                    onClick={() =>
                                        link.url &&
                                        router.get(
                                            link.url,
                                            { search },
                                            { preserveState: true },
                                        )
                                    }
                                    disabled={!link.url || link.active}
                                    className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                                        link.active
                                            ? "bg-amber-600 text-white border-amber-600"
                                            : !link.url
                                              ? "bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed"
                                              : "bg-white text-stone-700 border-stone-300 hover:bg-stone-50"
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
