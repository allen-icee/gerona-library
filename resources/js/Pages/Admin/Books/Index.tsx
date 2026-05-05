// resources/js/Pages/Admin/Books/Index.tsx
import { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, Link } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Icon } from "@iconify/react";
import { Input } from "@/Components/ui/input";
import { toast } from "sonner";
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
    recentBooks = [],
    filters,
}: PageProps<{
    books: any;
    recentBooks?: any[];
    filters: { search?: string };
}>) {
    const [search, setSearch] = useState(filters.search || "");
    const [isRecentExpanded, setIsRecentExpanded] = useState(false);

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

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        toast.loading("Importing CSV records...", { id: "csv-import" });

        const formData = new FormData();
        formData.append("csv_file", file);

        router.post(route("books.import"), formData, {
            preserveScroll: true,
            onSuccess: () =>
                toast.success("Master catalog updated from CSV!", {
                    id: "csv-import",
                }),
            onError: () =>
                toast.error("Failed to import CSV. Check file format.", {
                    id: "csv-import",
                }),
        });

        e.target.value = "";
    };

    const recentLimit = 3;
    const displayedRecentBooks = isRecentExpanded
        ? recentBooks
        : recentBooks.slice(0, recentLimit);

    return (
        <AdminLayout>
            <Head title="Master Catalog" />
            <div className="max-w-full space-y-6">
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-4 rounded-2xl border border-pink-100 shadow-sm shadow-pink-100/50">
                    <div className="flex items-center gap-3 w-full xl:w-auto">
                        <div className="bg-linear-to-br from-pink-400 to-pink-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-md shadow-pink-300 text-white shrink-0">
                            <Icon
                                icon="solar:book-bookmark-bold-duotone"
                                className="w-6 h-6"
                            />
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

                    <div className="flex flex-col md:flex-row w-full xl:w-auto items-stretch md:items-center gap-3">
                        <div className="relative w-full md:w-72 shrink-0">
                            <Icon
                                icon="solar:magnifer-bold-duotone"
                                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-400"
                            />
                            <Input
                                placeholder="Search title, author, or ISBN..."
                                className="pl-9 bg-stone-50 border-pink-100 focus-visible:ring-pink-500 h-10 rounded-xl shadow-sm text-sm w-full"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col min-[480px]:flex-row w-full gap-2 shrink-0">
                            <a
                                href={route("books.export")}
                                className="flex-1 min-[480px]:flex-none flex items-center justify-center px-4 h-10 text-xs font-bold transition-all bg-pink-50 text-pink-600 hover:bg-pink-500 hover:text-white rounded-xl border border-pink-200 shadow-sm group whitespace-nowrap"
                            >
                                <Icon
                                    icon="solar:download-square-bold-duotone"
                                    className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform"
                                />{" "}
                                Export
                            </a>

                            <label className="flex-1 min-[480px]:flex-none flex items-center justify-center px-4 h-10 text-xs font-bold transition-all bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl border border-emerald-200 shadow-sm cursor-pointer group whitespace-nowrap">
                                <Icon
                                    icon="solar:upload-square-bold-duotone"
                                    className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform"
                                />
                                Import CSV
                                <input
                                    type="file"
                                    accept=".csv"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                />
                            </label>

                            <div className="flex-1 min-[480px]:flex-none flex *:w-full">
                                <AddBookModal />
                            </div>
                        </div>
                    </div>
                </div>

                {recentBooks.length > 0 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-2 mb-3 px-1">
                            <Icon
                                icon="solar:clock-circle-bold-duotone"
                                className="w-5 h-5 text-emerald-500"
                            />
                            <h2 className="text-sm font-black text-slate-800 tracking-tight uppercase">
                                Today's Recent Inputs
                            </h2>
                        </div>

                        <div className="w-full bg-emerald-50/40 rounded-2xl border border-emerald-100 shadow-sm overflow-hidden flex flex-col">
                            <div className="overflow-x-auto">
                                <Table className="w-full min-w-[800px]">
                                    <TableHeader className="bg-emerald-100/50">
                                        <TableRow>
                                            <TableHead className="font-bold text-emerald-700 uppercase text-[10px] tracking-wider pl-6">
                                                Title
                                            </TableHead>
                                            <TableHead className="font-bold text-emerald-700 uppercase text-[10px] tracking-wider">
                                                Author
                                            </TableHead>
                                            <TableHead className="font-bold text-emerald-700 uppercase text-[10px] tracking-wider">
                                                Accession No.
                                            </TableHead>
                                            <TableHead className="font-bold text-emerald-700 uppercase text-[10px] tracking-wider text-center">
                                                Copies Added
                                            </TableHead>
                                            <TableHead className="font-bold text-emerald-700 uppercase text-[10px] tracking-wider text-right pr-6">
                                                Time Added
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {displayedRecentBooks.map((book) => (
                                            <TableRow
                                                key={`recent-${book.id}`}
                                                className="hover:bg-emerald-50/80 transition-colors border-emerald-100/50"
                                            >
                                                <TableCell className="font-bold text-slate-800 pl-6 text-xs uppercase">
                                                    {book.title}
                                                </TableCell>
                                                <TableCell className="text-slate-600 text-xs">
                                                    {book.author}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-mono text-[10px] font-bold text-emerald-700 bg-white border border-emerald-200 px-2 py-0.5 rounded-md shadow-sm whitespace-nowrap">
                                                        {book.copies &&
                                                        book.copies.length > 0
                                                            ? book.copies[
                                                                  book.copies
                                                                      .length -
                                                                      1
                                                              ].accession_number
                                                            : "N/A"}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <span className="bg-white text-emerald-600 py-0.5 px-2.5 rounded-md text-[10px] font-black border border-emerald-100 shadow-sm inline-block min-w-8 text-center">
                                                        +{book.copies_count}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right pr-6 text-[11px] text-stone-500 font-bold uppercase tracking-widest whitespace-nowrap">
                                                    {new Date(
                                                        book.created_at,
                                                    ).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {recentBooks.length > recentLimit && (
                                <button
                                    onClick={() =>
                                        setIsRecentExpanded(!isRecentExpanded)
                                    }
                                    className="w-full py-2.5 bg-emerald-100/30 hover:bg-emerald-100/60 transition-colors border-t border-emerald-100 text-[11px] font-bold text-emerald-600 uppercase tracking-widest flex items-center justify-center gap-2"
                                >
                                    {isRecentExpanded ? (
                                        <>
                                            Hide extra entries{" "}
                                            <Icon
                                                icon="solar:alt-arrow-up-bold-duotone"
                                                className="w-4 h-4"
                                            />
                                        </>
                                    ) : (
                                        <>
                                            View all {recentBooks.length} recent
                                            entries{" "}
                                            <Icon
                                                icon="solar:alt-arrow-down-bold-duotone"
                                                className="w-4 h-4"
                                            />
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <div className="bg-white border border-pink-100 rounded-xl shadow-sm flex flex-col mt-8">
                    <div className="w-full overflow-x-auto">
                        <Table className="w-full min-w-[950px]">
                            <TableHeader className="bg-stone-50/50 border-b border-pink-100">
                                <TableRow>
                                    <TableHead className="text-[10px] uppercase text-stone-400 font-bold pl-6">
                                        Title
                                    </TableHead>
                                    <TableHead className="text-[10px] uppercase text-stone-400 font-bold">
                                        Author
                                    </TableHead>
                                    <TableHead className="text-[10px] uppercase text-stone-400 font-bold">
                                        Category
                                    </TableHead>

                                    <TableHead className="text-[10px] uppercase text-stone-400 font-bold">
                                        Latest Accession No.
                                    </TableHead>
                                    <TableHead className="text-[10px] uppercase text-stone-400 font-bold text-center">
                                        Physical Copies
                                    </TableHead>
                                    <TableHead className="text-[10px] uppercase text-stone-400 font-bold text-right pr-6">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {books.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-32 text-center text-xs font-bold text-stone-400 uppercase tracking-widest"
                                        >
                                            No books found in catalog.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    books.data.map((book: any) => (
                                        <TableRow
                                            key={book.id}
                                            className="hover:bg-pink-50/30 transition-colors border-pink-50"
                                        >
                                            <TableCell className="font-bold text-slate-800 pl-6 py-3 uppercase">
                                                {book.title}
                                            </TableCell>

                                            <TableCell className="py-3">
                                                <div
                                                    className="text-stone-600 font-medium text-sm truncate max-w-[150px] sm:max-w-[200px] cursor-help"
                                                    title={book.author}
                                                >
                                                    {book.author}
                                                </div>
                                            </TableCell>

                                            <TableCell className="py-3">
                                                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-stone-100 text-stone-600 border border-stone-200">
                                                    {book.category ||
                                                        "Uncategorized"}
                                                </span>
                                            </TableCell>

                                            <TableCell className="py-3">
                                                <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md whitespace-nowrap">
                                                    {book.copies &&
                                                    book.copies.length > 0
                                                        ? book.copies[
                                                              book.copies
                                                                  .length - 1
                                                          ].accession_number
                                                        : "No Copies Yet"}
                                                </span>
                                            </TableCell>

                                            <TableCell className="text-center py-3">
                                                <span
                                                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-black border ${book.copies_count > 0 ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-red-50 text-red-600 border-red-200"} whitespace-nowrap`}
                                                >
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

                    <div className="p-4 border-t border-pink-50 bg-stone-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span className="text-xs font-medium text-stone-500 whitespace-nowrap">
                            Showing{" "}
                            <span className="font-black text-slate-800">
                                {books.from || 0}
                            </span>{" "}
                            to{" "}
                            <span className="font-black text-slate-800">
                                {books.to || 0}
                            </span>{" "}
                            of{" "}
                            <span className="font-black text-slate-800">
                                {books.total}
                            </span>{" "}
                            records
                        </span>

                        <div className="flex flex-wrap justify-center gap-1">
                            {books.links.map((link: any, index: number) => {
                                const isActive = link.active;
                                const isNull = !link.url;

                                const linkClasses = `px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                                    isActive
                                        ? "bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-200"
                                        : "bg-white text-stone-600 border-stone-200 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200"
                                } ${isNull ? "opacity-50 cursor-not-allowed bg-stone-100 hover:bg-stone-100 hover:text-stone-600 hover:border-stone-200" : ""}`;

                                return isNull ? (
                                    <span
                                        key={index}
                                        className={linkClasses}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ) : (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        preserveScroll
                                        preserveState
                                        className={linkClasses}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
