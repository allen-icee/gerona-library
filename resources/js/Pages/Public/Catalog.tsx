import { FormEventHandler } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { PageProps } from "@/types";
import {
    Search,
    BookOpen,
    Library,
    CheckCircle2,
    XCircle,
    Printer,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/Components/ui/card";

interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string;
    category: string;
    published_year: string;
    total_copies: number;
    available_copies: number;
}

export default function Catalog({
    books,
    filters,
}: PageProps<{ books: any; filters: any }>) {
    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
    });

    const handleSearch: FormEventHandler = (e) => {
        e.preventDefault();
        get(route("catalog.index"), { preserveState: true });
    };

    return (
        <div className="min-h-screen bg-stone-100 flex flex-col">
            <Head title="Library Catalog" />

            {/* Public Navigation Bar */}
            <header className="bg-slate-900 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Library className="w-8 h-8 text-amber-500" />
                        <span className="text-xl font-serif font-bold tracking-tight">
                            Gerona Municipal Library
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href={route("print-station.index")}
                            className="text-sm font-medium text-slate-300 hover:text-white flex items-center transition-colors"
                        >
                            <Printer className="w-4 h-4 mr-2" /> Print Station
                        </Link>
                        <div className="w-px h-6 bg-slate-700 mx-2"></div>
                        <Link
                            href={route("login")}
                            className="text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors"
                        >
                            Staff Login
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Search Section */}
            <div className="bg-slate-800 py-16 px-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400 to-transparent"></div>
                <div className="max-w-3xl mx-auto text-center relative z-10 space-y-6">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">
                        Find Your Next Great Read
                    </h1>
                    <p className="text-slate-300 text-lg">
                        Search the complete catalog of books, modules, and
                        resources available at the Gerona Municipal Library.
                    </p>

                    <form
                        onSubmit={handleSearch}
                        className="flex gap-2 max-w-2xl mx-auto mt-8"
                    >
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 w-5 h-5" />
                            <Input
                                type="text"
                                placeholder="Search by title, author, category, or ISBN..."
                                value={data.search}
                                onChange={(e) =>
                                    setData("search", e.target.value)
                                }
                                className="w-full pl-10 h-14 text-lg rounded-full bg-white border-none shadow-inner text-stone-800 placeholder:text-stone-400 focus-visible:ring-amber-500"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="h-14 px-8 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-bold text-lg shadow-md transition-all"
                        >
                            Search
                        </Button>
                    </form>
                </div>
            </div>

            {/* Book Grid Section */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                {books.data.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-2xl border border-stone-200 shadow-sm">
                        <BookOpen className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-stone-800">
                            No books found
                        </h3>
                        <p className="text-stone-500 mt-2">
                            Try adjusting your search terms or browse a
                            different category.
                        </p>
                        {data.search && (
                            <Button
                                variant="outline"
                                className="mt-6"
                                onClick={() => {
                                    setData("search", "");
                                    get(route("catalog.index"));
                                }}
                            >
                                Clear Search
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {books.data.map((book: Book) => (
                            <Card
                                key={book.id}
                                className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 border-stone-200 overflow-hidden group"
                            >
                                <CardHeader className="bg-stone-50 border-b border-stone-100 pb-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-100 px-2 py-1 rounded">
                                            {book.category}
                                        </span>
                                    </div>
                                    <h2 className="text-lg font-bold text-stone-800 leading-tight group-hover:text-amber-700 transition-colors line-clamp-2">
                                        {book.title}
                                    </h2>
                                    <p className="text-sm text-stone-600 font-medium">
                                        {book.author}
                                    </p>
                                </CardHeader>
                                <CardContent className="flex-1 pt-4 space-y-2">
                                    <div className="text-sm text-stone-500 grid grid-cols-2 gap-y-1">
                                        <span className="font-semibold text-stone-700">
                                            ISBN:
                                        </span>
                                        <span className="text-right truncate">
                                            {book.isbn || "N/A"}
                                        </span>
                                        <span className="font-semibold text-stone-700">
                                            Published:
                                        </span>
                                        <span className="text-right">
                                            {book.published_year || "Unknown"}
                                        </span>
                                    </div>
                                </CardContent>
                                <CardFooter className="bg-stone-50 border-t border-stone-100 py-3">
                                    {book.available_copies > 0 ? (
                                        <div className="flex items-center text-emerald-700 text-sm font-bold w-full">
                                            <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-500" />
                                            Available ({book.available_copies}{" "}
                                            of {book.total_copies})
                                        </div>
                                    ) : (
                                        <div className="flex items-center text-red-700 text-sm font-bold w-full">
                                            <XCircle className="w-5 h-5 mr-2 text-red-500" />
                                            Currently Borrowed
                                        </div>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Pagination (If more than 12 books) */}
                {books.links && books.links.length > 3 && (
                    <div className="mt-12 flex justify-center gap-1 flex-wrap">
                        {books.links.map((link: any, index: number) => (
                            <Link
                                key={index}
                                href={link.url || "#"}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                    link.active
                                        ? "bg-amber-600 text-white shadow"
                                        : !link.url
                                          ? "text-stone-400 cursor-not-allowed hidden md:inline-block"
                                          : "bg-white text-stone-700 border border-stone-300 hover:bg-stone-50"
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
