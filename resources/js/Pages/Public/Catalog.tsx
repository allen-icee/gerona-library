import { FormEventHandler } from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { Input } from "@/Components/ui/input";

interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string;
    category: string;
    available_copies: number;
}

export default function Catalog({ books, filters }: any) {
    const { data, setData, get } = useForm({ search: filters.search || "" });

    const handleSearch: FormEventHandler = (e) => {
        e.preventDefault();
        get(route("catalog.index"), { preserveState: true });
    };

    return (
        <PublicLayout>
            <Head title="Library Catalog" />

            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* --- COMPACT HEADER & SEARCH --- */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-pink-50">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 text-rose-500 font-potta text-[10px] uppercase tracking-widest mb-1">
                            <Icon
                                icon="solar:library-bold-duotone"
                                className="w-4 h-4"
                            />
                            Public Collection
                        </div>
                        <h1 className="text-3xl md:text-4xl font-serif font-black text-slate-800 tracking-tight">
                            Browse{" "}
                            <span className="text-rose-500">Catalog</span>
                        </h1>
                        <p className="text-stone-400 text-sm font-medium">
                            Explore {books.total || 0} items in our municipal
                            collection.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSearch}
                        className="w-full md:w-96 relative group"
                    >
                        <Input
                            value={data.search}
                            onChange={(e) => setData("search", e.target.value)}
                            placeholder="Title, Author, or ISBN..."
                            className="h-12 pl-12 pr-4 rounded-2xl border-2 border-pink-100 focus:border-rose-300 text-sm shadow-sm transition-all bg-pink-50/30"
                        />
                        <Icon
                            icon="solar:magnifer-bold-duotone"
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-rose-500 transition-colors"
                        />
                    </form>
                </div>

                {/* --- BOOK GRID --- */}
                {books.data.length === 0 ? (
                    <div className="text-center py-20 bg-rose-50/30 rounded-[2rem] border-2 border-dashed border-pink-100">
                        <Icon
                            icon="solar:ghost-bold-duotone"
                            className="w-16 h-16 text-rose-200 mx-auto mb-4"
                        />
                        <h3 className="text-xl font-black text-stone-700 font-potta uppercase tracking-wide">
                            No books found
                        </h3>
                        <p className="text-stone-400 text-sm mt-1">
                            Try searching for something else!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 md:gap-x-6 gap-y-10">
                        {books.data.map((book: Book) => (
                            <div
                                key={book.id}
                                className="group cursor-pointer flex flex-col h-full"
                            >
                                {/* Cover Art Container */}
                                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-white shadow-md border-2 border-pink-50 group-hover:shadow-xl group-hover:border-rose-200 group-hover:-translate-y-1 transition-all duration-300">
                                    {book.isbn ? (
                                        <img
                                            src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg?default=false`}
                                            alt={book.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (
                                                    e.target as HTMLImageElement
                                                ).src =
                                                    "https://placehold.co/400x600/fff1f2/e11d48?text=No+Cover";
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-rose-50 flex items-center justify-center">
                                            <Icon
                                                icon="solar:book-2-bold-duotone"
                                                className="w-10 h-10 text-rose-200"
                                            />
                                        </div>
                                    )}

                                    {/* Status Badge */}
                                    <div className="absolute top-2 right-2">
                                        <div
                                            className={`backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg shadow-sm flex items-center gap-1 ${book.available_copies > 0 ? "bg-emerald-500/80" : "bg-stone-800/80"}`}
                                        >
                                            <Icon
                                                icon={
                                                    book.available_copies > 0
                                                        ? "solar:check-circle-bold"
                                                        : "solar:clock-circle-bold"
                                                }
                                                className="w-3 h-3"
                                            />
                                            {book.available_copies > 0
                                                ? "In"
                                                : "Out"}
                                        </div>
                                    </div>
                                </div>

                                {/* Book Info */}
                                <div className="mt-4 flex flex-col px-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-1 font-potta">
                                        {book.category}
                                    </span>
                                    <h3 className="font-serif font-black text-slate-800 text-sm leading-snug group-hover:text-rose-500 transition-colors line-clamp-2">
                                        {book.title}
                                    </h3>
                                    <p className="text-stone-400 text-xs mt-1 font-medium">
                                        {book.author}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* --- PAGINATION --- */}
                {books.links && books.links.length > 3 && (
                    <div className="mt-12 mb-6 flex justify-center gap-1.5 flex-wrap">
                        {books.links.map((link: any, index: number) => (
                            <Link
                                key={index}
                                href={link.url || "#"}
                                className={`h-10 px-4 flex items-center justify-center text-xs font-black rounded-xl transition-all ${
                                    link.active
                                        ? "bg-rose-500 text-white shadow-md shadow-rose-200"
                                        : !link.url
                                          ? "text-stone-300 cursor-not-allowed opacity-50"
                                          : "bg-white text-stone-500 border-2 border-pink-50 hover:border-rose-200 hover:text-rose-500"
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
