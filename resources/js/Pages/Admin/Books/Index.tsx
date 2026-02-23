import { useState, useEffect, FormEventHandler } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Search, Plus } from "lucide-react";
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

// Updated to match your actual database schema + the withCount('copies')
interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string;
    publisher: string;
    year_published: string;
    category: string;
    language: string;
    copies_count: number;
}

interface PaginationData {
    data: Book[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
}

export default function BookIndex({
    books,
    filters,
}: PageProps<{ books: PaginationData; filters: { search?: string } }>) {
    const [search, setSearch] = useState(filters.search || "");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Form state matches your Book.php fillable array
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            title: "",
            author: "",
            isbn: "",
            publisher: "",
            year_published: "",
            category: "",
            language: "",
        });

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

    const submitNewBook: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("books.store"), {
            preserveScroll: true,
            onSuccess: () => {
                setIsAddModalOpen(false);
                reset();
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Master Catalog" />

            <div className="max-w-7xl mx-auto space-y-6">
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
                                    Add Master Record
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] bg-white">
                                <DialogHeader>
                                    <DialogTitle>
                                        Add Master Book Record
                                    </DialogTitle>
                                    <DialogDescription>
                                        Create a new catalog entry. You can add
                                        physical copies to this record later.
                                    </DialogDescription>
                                </DialogHeader>

                                <form
                                    onSubmit={submitNewBook}
                                    className="space-y-4 py-4"
                                >
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="title"
                                            className="text-stone-700"
                                        >
                                            Title *
                                        </Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) =>
                                                setData("title", e.target.value)
                                            }
                                            required
                                        />
                                        {errors.title && (
                                            <p className="text-sm text-red-600">
                                                {errors.title}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="author"
                                                className="text-stone-700"
                                            >
                                                Author *
                                            </Label>
                                            <Input
                                                id="author"
                                                value={data.author}
                                                onChange={(e) =>
                                                    setData(
                                                        "author",
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            />
                                            {errors.author && (
                                                <p className="text-sm text-red-600">
                                                    {errors.author}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="isbn"
                                                className="text-stone-700"
                                            >
                                                ISBN
                                            </Label>
                                            <Input
                                                id="isbn"
                                                value={data.isbn}
                                                onChange={(e) =>
                                                    setData(
                                                        "isbn",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {errors.isbn && (
                                                <p className="text-sm text-red-600">
                                                    {errors.isbn}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="publisher"
                                                className="text-stone-700"
                                            >
                                                Publisher
                                            </Label>
                                            <Input
                                                id="publisher"
                                                value={data.publisher}
                                                onChange={(e) =>
                                                    setData(
                                                        "publisher",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {errors.publisher && (
                                                <p className="text-sm text-red-600">
                                                    {errors.publisher}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="year_published"
                                                className="text-stone-700"
                                            >
                                                Year
                                            </Label>
                                            <Input
                                                id="year_published"
                                                value={data.year_published}
                                                onChange={(e) =>
                                                    setData(
                                                        "year_published",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="e.g. 2024"
                                            />
                                            {errors.year_published && (
                                                <p className="text-sm text-red-600">
                                                    {errors.year_published}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="category"
                                                className="text-stone-700"
                                            >
                                                Category
                                            </Label>
                                            <Input
                                                id="category"
                                                value={data.category}
                                                onChange={(e) =>
                                                    setData(
                                                        "category",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="e.g. Fiction, Science"
                                            />
                                            {errors.category && (
                                                <p className="text-sm text-red-600">
                                                    {errors.category}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="language"
                                                className="text-stone-700"
                                            >
                                                Language
                                            </Label>
                                            <Input
                                                id="language"
                                                value={data.language}
                                                onChange={(e) =>
                                                    setData(
                                                        "language",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="e.g. English, Tagalog"
                                            />
                                            {errors.language && (
                                                <p className="text-sm text-red-600">
                                                    {errors.language}
                                                </p>
                                            )}
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
                                <TableHead className="font-semibold text-stone-700">
                                    Year
                                </TableHead>
                                <TableHead className="font-semibold text-stone-700 text-right">
                                    Physical Copies
                                </TableHead>
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
                                books.data.map((book) => (
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
                                        <TableCell className="text-stone-600">
                                            {book.year_published || "-"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${book.copies_count > 0 ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-600"}`}
                                            >
                                                {book.copies_count} copies
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

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
                            {books.links.map((link, index) => (
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
