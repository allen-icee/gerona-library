import { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, Link } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Icon } from "@iconify/react";
import { Input } from "@/Components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";

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

            <div className="max-w-full space-y-6">

                {/* COMPACT HEADER */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-pink-100 shadow-sm shadow-pink-100/50">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-pink-400 to-pink-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-md shadow-pink-300 text-white">
                            <Icon icon="solar:book-bookmark-bold-duotone" className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">
                                Master Catalog
                            </h1>
                            <p className="text-slate-500 text-xs font-medium mt-1">
                                Manage master book records and inventory.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center gap-3">
                        {/* Search Bar */}
                        <div className="relative w-full sm:w-72">
                            <Icon icon="solar:magnifer-bold-duotone" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-400" />
                            <Input
                                placeholder="Search title, author, or ISBN..."
                                className="pl-9 bg-stone-50 border-pink-100 focus-visible:ring-pink-500 focus-visible:border-pink-500 h-10 rounded-xl shadow-sm text-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex w-full sm:w-auto gap-2">
                            <a
                                href={route("books.export")}
                                className="inline-flex items-center justify-center flex-1 sm:flex-none px-4 h-10 text-xs font-bold transition-all bg-pink-50 text-pink-600 hover:bg-pink-500 hover:text-white rounded-xl border border-pink-200 shadow-sm group"
                            >
                                <Icon icon="solar:download-square-bold-duotone" className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform" />
                                Export
                            </a>

                            <AddBookModal />
                        </div>
                    </div>
                </div>

                {/* DATA TABLE */}
                <div className="bg-white border border-pink-100 rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-white hover:bg-white border-b border-pink-50">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="text-[10px] uppercase text-stone-400 font-bold tracking-wider pl-6">Title</TableHead>
                                    <TableHead className="text-[10px] uppercase text-stone-400 font-bold tracking-wider">Author</TableHead>
                                    <TableHead className="text-[10px] uppercase text-stone-400 font-bold tracking-wider">Category</TableHead>
                                    <TableHead className="text-[10px] uppercase text-stone-400 font-bold tracking-wider text-center">Physical Copies</TableHead>
                                    <TableHead className="text-[10px] uppercase text-stone-400 font-bold tracking-wider text-right pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {books.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-xs text-stone-400 font-medium">
                                            No books found in the catalog.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    books.data.map((book: any) => (
                                        <TableRow key={book.id} className="hover:bg-pink-50/30 transition-colors border-pink-50">
                                            <TableCell className="font-bold text-slate-800 pl-6 py-3">
                                                {book.title}
                                            </TableCell>
                                            <TableCell className="text-stone-600 font-medium text-sm py-3">
                                                {book.author}
                                            </TableCell>
                                            <TableCell className="py-3">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-black bg-stone-100 text-stone-600 border border-stone-200">
                                                    {book.category || "Uncategorized"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center py-3">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-black border ${book.copies_count > 0 ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                                                    {book.copies_count} copies
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right pr-6 py-3">
                                                <BookActions book={book} />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* PAGINATION */}
                    {books.links && books.links.length > 3 && (
                        <div className="bg-slate-50 border-t border-stone-100 px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
                            <p className="text-[11px] text-stone-500 font-medium">
                                Showing <span className="font-bold text-slate-700">{books.from}</span> to <span className="font-bold text-slate-700">{books.to}</span> of <span className="font-bold text-slate-700">{books.total}</span> books
                            </p>
                            <div className="flex items-center gap-1">
                                {books.links.map((link: any, i: number) => (
                                    <Link
                                        key={i}
                                        href={link.url || "#"}
                                        className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors ${link.active
                                            ? "bg-pink-500 text-white shadow-sm shadow-pink-200"
                                            : "bg-white text-slate-500 border border-slate-200 hover:border-pink-300 hover:text-pink-500"
                                            } ${!link.url && "opacity-50 cursor-not-allowed"}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}